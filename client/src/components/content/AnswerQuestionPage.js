import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../GlobalContext";
import { useMainPageContext } from "../MainPageContext";
import { isEmpty } from "../utils";

function AnswerQuestionPage({ getAllQuestions, getAllAnswers }) {
	const [text, setText] = useState("");
	const [username, setUsername] = useState("");
	const [textError, setTextError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const { answers, setAnswers, activeUser, updateAnswersFromDatabase } = useGlobalContext();
	const { setActiveTab, activeQuestionQid } = useMainPageContext();

	const processText = (originalText) => {
		return originalText.replace(
			/\[(.*?)\]\((.*?)\)/g,
			(match, text, url) => {
				return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
			}
		);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		setTextError(false);
		setUsernameError(false);

		let badInput = false;

		// CHECK TEXT INPUT
		if (text.length === 0) {
			setTextError(true);
			badInput = true;
		}

		// CHECK USERNAME INPUT
		if (username.length === 0 && isEmpty(activeUser)) {
			setUsernameError(true);
			badInput = true;
		}

		if (!badInput) {
			const processedText = processText(text);
			var answerData = {
				questionId: activeQuestionQid,
				text: processedText,
				email: username,
				date: new Date().toISOString(),
			};
			if (!isEmpty(activeUser)) {
				answerData = {
					questionId: activeQuestionQid,
					text: processedText,
					email: activeUser.email,
					date: new Date().toISOString(),
				};
			}
			console.log(answerData);
			axios
				.post("http://localhost:8000/submitAnswer", answerData)
				.then((response) => {
					console.log("Answer submitted:", response.data);
					setActiveTab(3);
					//getAllQuestions();
					//getAllAnswers();
				})
				.catch((error) => {
					console.error("Error submitting the answer:", error);
				});
			setAnswers(answers => [...answers, answerData])
			updateAnswersFromDatabase();
			console.log(answers);
		}
	};

	return (
		<div className="askQuesPage" id="askQuesPage">
			<h1 id="formText">Answer your question:</h1>
			<form className="quesForm" id="quesForm" onSubmit={handleSubmit}>
				<div id="questionText">
					<h2>Your Answer*</h2>
					<p>
						<em>Add your answer</em>
					</p>
					<textarea
						className="askQuestionInput"
						id="questionTextInput"
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					{textError && (
						<p style={{ color: "red" }}>Text cannot be empty</p>
					)}
				</div>

				{isEmpty(activeUser) && (
					<div id="questionUsername">
						<h2>Display Name*</h2>
						<input
							className="askQuestionInput"
							id="questionUsernameInput"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						{usernameError && (
							<p style={{ color: "red" }}>
								Username cannot be empty
							</p>
						)}
					</div>
				)}

				<div id="questionSubmit">
					<button
						type="submit"
						className="askQuestionButton"
						id="askQBtn"
						onClick={handleSubmit}
					>
						Post Your Answer
					</button>
				</div>
			</form>
		</div>
	);
}

export default AnswerQuestionPage;
