import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useGlobalContext } from "../GlobalContext";

import AnswerQuestionPage from "../content/AnswerQuestionPage";
import AskQuestionPage from "../content/AskQuestionPage";
import TagsPage from "../content/TagsPage";
import AnswersPage from "../content/AnswersPage";
import QuestionsPage from "../content/QuestionsPage";
import EditQuestionPage from "../content/EditQuestionPage";
import LoginPage from "../content/LoginPage";
import RegisterPage from "../content/RegisterPage";
import UserProfile from "../content/UserProfile";
import WelcomePage from "../content/WelcomePage";

import { isEmpty } from "../utils";
import { useMainPageContext } from "../MainPageContext";

function MainBody() {
    const {
		currentSearch,
		questions,
		setQuestions,
		tags,
		answers,
	} = useGlobalContext();
	const {
		setActiveTab,
		activeTab,
		setActiveTag,
		activeTag,
		setActiveSort,
		activeSort,
		activeQuestionQid,
		setActiveQuestionQid,
	} = useMainPageContext();

	const incrementViews = useCallback(() => {
		axios
			.patch(`http://localhost:8000/incrementViews/${activeQuestionQid}`)
			.then((response) => {
				setQuestions((prevQuestions) =>
					prevQuestions.map((q) => {
						if (q._id === activeQuestionQid) {
							return { ...q, views: q.views + 1 };
						}
						return q;
					})
				);
			})
			.catch((error) => {
				console.error("Error incrementing views:", error);
			});
	}, [activeQuestionQid, setQuestions]);
	const addNewQuestion = (newQuestion) => {
		setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
	};

	switch (activeTab) {
		case 0: // Questions page
			return (
				<QuestionsPage
					/*setActiveTab={setActiveTab}
					currQuestions={displayedQuestions}
					setActiveSort={setActiveSort}
					setActiveQuestionQid={setActiveQuestionQid}
					setActiveTag={setActiveTag}
					tags={tags}*/
				/>
			);
		case 1: // Tags page
			return (
				<TagsPage
					/*setActiveTab={setActiveTab}
					setActiveTag={setActiveTag}
					setActiveSort={setActiveSort}
					tags={tags}
					questions={questions}*/
				/>
			);
		case 2: // Ask question page
			// Logic for ask question page (to be implemented)
			return (
				<AskQuestionPage
					/*addNewQuestion={addNewQuestion}
					setActiveTab={setActiveTab}
					setActiveSort={setActiveSort}
					getAllTags={getAllTags}*/
				/>
			);
		case 3: // Answers page
			return (
				<AnswersPage
					/*setActiveTab={setActiveTab}
					activeQuestionQid={activeQuestionQid}
					questions={questions}
					answers={answers}
					tags={tags}*/
					incrementViews={incrementViews}
				/>
			);
		case 4:
			return (
				<AnswerQuestionPage
					/*setActiveTab={setActiveTab}
					setActiveQuestionQid={setActiveQuestionQid}
					activeQuestionQid={activeQuestionQid}
					getAllQuestions={getAllQuestions}
					getAllAnswers={getAllAnswers}*/
				/>
			);
		// first page when entering application-welcome page
		case 5:
			return <WelcomePage /*setActiveTab={setActiveTab}*/ />;
		// register page
		case 6:
			return (
				<RegisterPage
					/*setActiveTab={setActiveTab}
					questions={questions}
					answers={answers}
					tags={tags}
					users={users}
					setQuestions={setQuestions}
					setAnswers={setAnswers}
					setTags={setTags}
					setUsers={setUsers}*/
				/>
			);
		// login page
		case 7:
			return (
				<LoginPage
					/*setActiveTab={setActiveTab}
					users={users}
					setActiveUser={setActiveUser}*/
				/>
			);
		// user profile page
		case 8:
			return (
				<UserProfile
					/*activeUser={activeUser}
					questions={questions}
					setEditQuestion={setEditQuestion}
					tags={tags}
					setActiveTab={setActiveTab}*/
				/>
			);
		case 9:
			return (
				<EditQuestionPage
					/*editQuestion={editQuestion}
					tags={tags}
					getAllTags={getAllTags}
					questions={questions}
					users={users}
					getAllQuestions={getAllQuestions}*/
				/>
			);
		default:
			// Default case logic
			return (
				<QuestionsPage
					//setActiveTab={setActiveTab}
					//currQuestions={displayedQuestions}
					//setActiveSort={setActiveSort}
					setActiveQuestionQid={setActiveQuestionQid}
					//setActiveTag={setActiveTag}
					//tags={tags}
				/>
			);
	}
}
export default MainBody;
