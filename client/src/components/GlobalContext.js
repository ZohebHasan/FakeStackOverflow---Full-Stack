import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Creating the context
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [users, setUsers] = useState([]);
	const [comments, setComments] = useState([]);
	const [activeUser, setActiveUser] = useState(null);

	const updateUsersFromDatabase = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/allUsers"
			);
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users from database:", error);
		}
	};
	const getAllTags = () => {
		const allTags = questions.map(question => question.tags).flat();
		const uniqueTags = [...new Set(allTags)];
		return uniqueTags;
	}
	const updateQuestionsFromDatabase = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/allQuestions"
			);
			setQuestions(response.data);
		} catch (error) {
			console.error("Error fetching questions from database:", error);
		}
	};/*
	const updateTagsFromDatabase = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/allTags"
			);
			setTags(response.data);
		} catch (error) {
			console.error("Error fetching tags from database:", error);
		}
	};*/
	const updateAnswersFromDatabase = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/allAnswers"
			);
			setAnswers(response.data);
		} catch (error) {
			console.error("Error fetching answers from database:", error);
		}
	};/*
	const updateCommentsFromDatabase = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/allComments"
			);
			setComments(response.data);
		} catch (error) {
			console.error("Error fetching comments from database:", error);
		}
	};
	const updateAllFromDatabase = async () => {
		try {
			const [
				usersResponse,
				questionsResponse,
				tagsResponse,
				answersResponse,
				commentsResponse,
			] = await Promise.all([
				axios.get("http://localhost:8000/api/allUsers"),
				axios.get("http://localhost:8000/api/allQuestions"),
				axios.get("http://localhost:8000/api/allTags"),
				axios.get("http://localhost:8000/api/allAnswers"),
				axios.get("http://localhost:8000/api/allComments"),
			]);

			setUsers(usersResponse.data);
			setQuestions(questionsResponse.data);
			setTags(tagsResponse.data);
			setAnswers(answersResponse.data);
			setComments(commentsResponse.data);
		} catch (error) {
			console.error("Error fetching data from database:", error);
		}
	};*/

	return (
		<GlobalContext.Provider
			value={{
				questions,
				setQuestions,
				answers,
				setAnswers,
				comments,
				setComments,
				users,
				setUsers,
				activeUser,
				setActiveUser,
				updateUsersFromDatabase,
				//updateCommentsFromDatabase,
				updateQuestionsFromDatabase,
				//updateTagsFromDatabase,
				updateAnswersFromDatabase,
				//updateAllFromDatabase,
				getAllTags,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
