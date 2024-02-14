import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from './layout/TopBar';
import SideBar from './layout/SideBar';
import MainBody from './layout/MainBody';
import { useGlobalContext } from './GlobalContext';
import { useMainPageContext } from './MainPageContext';
function MainPage() {
	const {
		setQuestions,
		setAnswers,
	} = useGlobalContext();

	function getAllQuestions() {
		axios
			.get("http://localhost:8000/allQuestions")
			.then(function (res) {
				setQuestions(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function getAllAnswers() {
		axios
			.get("http://localhost:8000/allAnswers")
			.then((res) => {
				setAnswers(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	useEffect(() => {
		getAllQuestions();
		getAllAnswers();
	}, []);
	return (
		<>
			<TopBar />
			<div id="main" className="main">
				<SideBar />
				<div className="mainBody">
					<MainBody />
				</div>
			</div>
		</>
	);
}
export default MainPage;