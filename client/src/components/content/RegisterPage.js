import React, {useState} from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../GlobalContext";
import { addUser, isEmpty } from '../utils';

function RegisterPage({ setActiveTab, users, setUsers }) {
	const [password, setPassword] = useState("");
	const [passwordVerif, setPasswordVerif] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [passwordVerifError, setPasswordVerifError] = useState(false);
	const navigate = useNavigate();

	async function getAllUsers() {
		let userData;
		await axios
			.get("http://localhost:8000/allUsers")
			.then(function (res) {
				//setUsers(res.data);
				userData = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
		console.log(userData);
		return userData;
	}

	function passwordValid() {
		let email_id = email.split("@")[0];
		if (password.includes(email_id) || password.includes(username)) {
			return false;
		}
		return true;
	}

	function passwordVerified() {
		if (passwordVerif !== password) {
			return false;
		}
		return true;
	}

	function emailValid() {
		if (email.includes(username)) return false;
		if (isEmpty(users)) {
			console.log("'users' is empty")
			return true;
		}
		const emails = users.map((user) => user.email);
		if (emails.includes(email)) {
			return false;
		}
		return true;
	}

	function usernameValid() {
		if (username.length === 0) {
			return false;
		}
		return true;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		let badInput = false;
		setUsernameError(false);
		setEmailError(false);
		setPasswordError(false);
		setPasswordVerifError(false);

		if (!usernameValid()) {
			setUsernameError(true);
			badInput = true;
		}
		if (!emailValid()) {
			setEmailError(true);
			badInput = true;
		}
		if (!passwordValid()) {
			setPasswordError(true);
			badInput = true;
		}
		if (!passwordVerified()) {
			setPasswordVerifError(true);
			badInput = true;
		}
		if (!badInput) {
			try {
				const saltRounds = 10;
				const hashedPassword = bcrypt.hashSync(password, saltRounds);

				let newUser = {
					username: username,
					email: email,
					password: hashedPassword,
					admin: false,
				};
				console.log(newUser);

				await addUser(newUser);
				await getAllUsers();
				//setActiveTab(7);
				navigate('/login');
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="registerContainer">
		<div className="registerWindow">
			<form className="registerQuestionForm" onSubmit={handleSubmit}>
				<h2>Create Your Account</h2>

				{/* Username Input */}
				<input
					className="registerFormInput"
					type="text"
					placeholder="Username"
					onChange={(e) => setUsername(e.target.value)}
				/>
				{usernameError && <div className="error">Enter a username</div>}

				{/* Email Input */}
				<input
					className="registerFormInput"
					type="text"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				{emailError && <div className="error">Enter a valid email</div>}

				{/* Password Input */}
				<input
					className="registerFormInput"
					type="password"
					autoComplete="new-password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				{passwordError && <div className="error">Enter a valid password</div>}

				{/* Verify Password Input */}
				<input
					className="registerFormInput"
					type="password"
					autoComplete="new-password"
					placeholder="Verify Password"
					onChange={(e) => setPasswordVerif(e.target.value)}
				/>
				{passwordVerifError && <div className="error">Passwords must match exactly</div>}

				<input
					id="registerUserBtn"
					type="submit"
					value="Sign Up"
				/>
			</form>
		</div>
	</div>
	);
}

export default RegisterPage;