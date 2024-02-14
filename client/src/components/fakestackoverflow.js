import React, { useState, useEffect, useCallback, useContext } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import axios from "axios";

import SideBar from "./layout/SideBar";
import TopBar from "./layout/TopBar";

import AnswerQuestionPage from "./content/AnswerQuestionPage";
import AskQuestionPage from "./content/AskQuestionPage";
import TagsPage from "./content/TagsPage";
import AnswersPage from "./content/AnswersPage";
import QuestionsPage from "./content/QuestionsPage";
import EditQuestionPage from "./content/EditQuestionPage";
import LoginPage from "./content/LoginPage";
import RegisterPage from "./content/RegisterPage";
import UserProfile from "./content/UserProfile";
import WelcomePage from "./content/WelcomePage";
import MainBody from "./layout/MainBody";
import MainPage from "./MainPage";

import { GlobalProvider, useGlobalContext } from "./GlobalContext";
import { MainPageProvider } from "./MainPageContext";

export default function fakeStackOverflow() {
	return (
		<GlobalProvider>
			<Router>
				<Routes>
					<Route path="/" element={<WelcomePage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/main"
						element={
							<MainPageProvider>
								<MainPage />
							</MainPageProvider>
						}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Router>
		</GlobalProvider>
	);
}
