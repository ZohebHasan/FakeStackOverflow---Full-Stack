import React from 'react';
import { useNavigate } from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
		navigate("/register"); // Navigates to the Register page
	};

	const handleLoginClick = () => {
		navigate("/login"); // Navigates to the Login page
	};

	const handleGuestClick = () => {
		navigate("/main"); // Navigates to the main application as a guest
	};
	
	return (
		<div className="welcomeContainer">
            <h1> Hi, Welcome to Fake Stack Overflow. </h1> 

			<div className="welcomeWindow">
				<div className="welcomeButton-container">
					<button
						className="welcomeButton"
						onClick={handleRegisterClick}
					>
						register as a new user
					</button>
					<button
						className="welcomeButton"
						onClick={handleLoginClick}
					>
						login as existing user
					</button>
					<button
						className="welcomeButton"
						onClick={handleGuestClick}
					>
						continue as guest
					</button>
				</div>
			</div>
		</div>
	);
}

export default WelcomePage;
