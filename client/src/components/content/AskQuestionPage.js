import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../GlobalContext";
import { isEmpty } from "../utils";
import { useMainPageContext } from "../MainPageContext";

function AskQuestionPage() {
	const { setActiveTab, setActiveSort } = useMainPageContext();
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [tags, setTags] = useState("");
	const [username, setUsername] = useState("");
	const { activeUser, setQuestions } = useGlobalContext();

	const validateInputs = () => {
		const tagsArray = tags.trim().split(/\s+/);
		const newErrors = {
			titleShort: title.length === 0,
			titleLong: title.length > 100,
			text: text.length === 0,
			tooManyTags: tagsArray.length > 5,
			tooLongTag: tagsArray.some((tag) => tag.length > 10),
			username: username.length === 0 && isEmpty(activeUser),
			hyperlink:
				/\[(.*?)\]\((.*?)\)/g.test(text) &&
				!text.match(/\[(.*?)\]\((http:\/\/|https:\/\/.*?)\)/g),
		};
		return Object.values(newErrors).every((val) => !val);
	};

	const processText = (originalText) => {
		return originalText.replace(
			/\[(.*?)\]\((.*?)\)/g,
			(match, text, url) => {
				return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
			}
		);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (validateInputs()) {
			const processedText = processText(text);
			const questionData = {
				title,
				text: processedText,
				tags: tags.trim().split(/\s+/),
				asked_by: activeUser,
				askDate: new Date().toISOString(),
			};
			//console.log(questionData.tags)
			//console.log(questionData);
			try {
				console.log(questionData);
				const response = await axios.post(
					"http://localhost:8000/createQuestion",
					questionData
				);
				console.log("Question submitted:", response.data);

				refreshQuestions();

				//getAllTags();
				setActiveSort(0);
				setActiveTab(0);
			} catch (error) {
				console.error("Error submitting the question:", error);
			}
		}
	};

	const refreshQuestions = () => {
		axios
			.get("http://localhost:8000/allQuestions")
			.then(function (res) {
				setQuestions(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<div className="askQuesPage" id="askQuesPage">
			<h1 id="formText">Ask your question:</h1>
			<form className="quesForm" id="quesForm" onSubmit={handleSubmit}>
				<div id="questionTitle">
					<h2>Question Title*</h2>
					<p>
						<em>Limit title to 100 characters or less</em>
					</p>
					<input
						className="askQuestionInput"
						id="questionTitleInput"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div id="questionText">
					<h2>Question Text*</h2>
					<p>
						<em>Add details</em>
					</p>
					<textarea
						className="askQuestionInput"
						id="questionTextInput"
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</div>

				<div id="questionTags">
					<h2>Tags*</h2>
					<p>
						<em>
							Space separated, limit 5 tags, 10 characters each
						</em>
					</p>
					<input
						className="askQuestionInput"
						id="questionTagsInput"
						type="text"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
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
					</div>
				)}
				<div id="questionSubmit">
					<button
						type="submit"
						className="askQuestionButton"
						id="askQBtn"
						onClick={handleSubmit}
					>
						Post Your Question
					</button>
				</div>
			</form>
		</div>
	);
}

export default AskQuestionPage;
