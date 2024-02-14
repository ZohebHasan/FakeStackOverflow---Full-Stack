import React, {useState, useEffect} from 'react';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from '../GlobalContext';

function LoginPage() {
	const {users} = useGlobalContext();
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const {updateUsersFromDatabase, setActiveUser} = useGlobalContext();
	const navigate = useNavigate();

	useEffect(()=>{
		updateUsersFromDatabase();
	},[updateUsersFromDatabase]);

	function emailValid() {
		const emails = users.map((user) => user.email);
		if (emails.includes(email)) {
			return true;
		}
		return false;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		let badInput = false;

		setEmailError(false);
		setPasswordError(false);

		if (!emailValid()) {
			setEmailError(true);
			badInput = true;
		}
		if (!badInput) {
			const matchingUser = users.find((user) => user.email === email);

			try {
				const passwordMatch = await bcrypt.compare(
					password,
					matchingUser.password
				);

				if (passwordMatch) {
					console.log("Password matched");
					const response = await axios.post(
						"http://localhost:8000/api/startSession",
						matchingUser,
						{
							withCredentials: true,
						}
					);
					console.log(response);
					setActiveUser(response.data.user);
					navigate("/main");
				} else {
					const match = matchingUser.password === password;
					if (match) {
						console.log("Password matched");
						const response = await axios.post(
							"http://localhost:8000/api/startSession",
							matchingUser,
							{
								withCredentials: true,
							}
						);
						console.log(response);
						setActiveUser(response.data.user);
						navigate("/main");
					} else {
						console.log("Password did not match");
						setPasswordError(true);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
        <div className="loginContainer">
            <div className="loginWindow">
                <form className="loginQuestionForm" onSubmit={handleSubmit}>
                    <h2>Sign In</h2>

                    <div id="loginEmail">
                        <input
                            className="loginFormInput"
                            id="loginEmailInput"
                            type="text"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && (
                            <div className="error">Enter a valid email</div>
                        )}
                    </div>

                    <div id="loginPassword">
                        <input
                            className="loginFormInput"
                            id="loginPasswordInput"
                            type="current-password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && (
                            <div className="error">Enter a valid password</div>
                        )}
                    </div>

                    <div className="formBottom">
                        <input
                            id="loginUserBtn"
                            type="submit"
                            value="Sign in"
                        />
                    </div>
                </form>
            </div>
        </div>
	);
}

export default LoginPage;





