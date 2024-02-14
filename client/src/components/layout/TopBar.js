import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMainPageContext } from "../MainPageContext";
import { useGlobalContext } from "../GlobalContext";
import { isEmpty } from "../utils";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useNavigate,
	Link,
} from "react-router-dom";

function TopBar() {
	const { setActiveTab, setCurrentSearch, setActiveSort, currentSearch } =
		useMainPageContext();
	const [searchBarInput, setSearchBarInput] = useState("");
	const { activeUser, setActiveUser } = useGlobalContext();
	const navigate = useNavigate();

	function handleSearch(event) {
		if (event.key === "Enter") {
			const searchString = searchBarInput;
			setCurrentSearch(searchString);
			console.log(searchString);
		}
	}
	useEffect(() => {
		if (currentSearch !== "") {
			setActiveSort(4);
			setActiveTab(0);
		}
	}, [currentSearch, setActiveSort, setActiveTab]);

	function handleInputChange(event) {
		setSearchBarInput(event.target.value);
	}

	const handleLogoClick = (event) => {
		event.preventDefault();
		setActiveTab(0);
		setActiveSort(0);
	};
	useEffect(() => {
		const checkUserSession = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/api/checkSession",
					{
						withCredentials: true,
					}
				);
				if (response.data.loggedIn) {
					setActiveUser(response.data.user);
				} else {
					setActiveUser(null);
				}
			} catch (error) {
				console.error("Error checking user session:", error);
			}
		};

		checkUserSession();
	}, [setActiveUser]);

	const handleLogout = async () => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/logout",
				{},
				{ withCredentials: true }
			);
			if (response.data.loggedIn === false) {
				setActiveUser(null);
				console.log(response.data.message);
				navigate("/");
			}
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<header>
			<div className="searchBarContainer">
				{isEmpty(activeUser) ? (
					<button
						className="askQuestionButton"
						id="askQBtn"
						onClick={() => {
							navigate("/login");
						}}
					>
						Log in
					</button>
				) : (
					<>
						<button
							className="askQuestionButton"
							id="askQBtn"
							onClick={() => {
								handleLogout();
								navigate("/");
							}}
						>
							Log out
						</button>
					</>
				)}
			</div>
			<div className="logoContainer">
				<a href="/" className="logo" onClick={handleLogoClick}>
					Fake Stack Overflow
				</a>
			</div>
			<div className="searchBarContainer">
				<input
					type="text"
					className="searchBar"
					id="realSearchBar"
					placeholder="Search . . ."
					onKeyDown={handleSearch}
					onChange={handleInputChange}
					value={searchBarInput}
				></input>
			</div>
		</header>
	);
}

export default TopBar;
