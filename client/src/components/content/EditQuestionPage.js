import React, { useState } from "react";
import axios from "axios";
import { numWords, addTag, convertTagNamesTo_Ids } from "../utils";
import { useGlobalContext } from "../GlobalContext";
import { useMainPageContext } from "../MainPageContext";

function EditQuestionPage() {
	const { editQuestion, setActiveTab } = useMainPageContext();
	const { questions, users, getAllTags, updateQuestionsFromDatabase } = useGlobalContext();
	const [title, setTitle] = useState(editQuestion?.title || "");
	const [text, setText] = useState(editQuestion?.text || "");
	const [newQuestionTags, setNewQuestionTags] = useState(
		editQuestion?.tags || ""
	);
	const [summary, setSummary] = useState(editQuestion?.summary || "");
	const [id, setId] = useState(editQuestion._id);
	const [titleError, setTitleError] = useState(false);
	const [textError, setTextError] = useState(false);
	const [tagsError, setTagsError] = useState(false);
	const [summaryError, setSummaryError] = useState(false);
	const [hyperlinkError, setHyperlinkError] = useState(false);
	const tags = getAllTags();
	let tagCount = tags.length;
	console.log(editQuestion)

	async function editExistingQuestion(updatedQuestion) {
		console.log(updatedQuestion.asked_by);
		try {
			const response = await axios.post(
				"http://localhost:8000/api/editQuestion",
				updatedQuestion
			);
			console.log(updatedQuestion);
			console.log(response);
			await updateQuestionsFromDatabase();
		} catch (error) {
			console.log(error);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(title);

		setTitleError(false);
		setTextError(false);
		setTagsError(false);
		setSummaryError(false);
		setHyperlinkError(false);

		let badInput = false;

		if (title.length === 0 || title.length > 100) {
			setTitleError(true);
			badInput = true;
		}

		let tempText = text;

		if (text.length === 0) {
			setTextError(true);
			badInput = true;
		} else {
			// Check for hyperlinks
			const regex = /\[(.*?)\]\((.*?)\)/g;
			const matches = text.matchAll(regex);
			for (const match of matches) {
				const linkText = match[1];
				const linkUrl = match[2];
				if (
					linkUrl.length === 0 ||
					(!linkUrl.startsWith("https://") &&
						!linkUrl.startsWith("http://"))
				) {
					setHyperlinkError(true);
					badInput = true;
				} else {
					const htmlLink = `</div><a href="${linkUrl}">${linkText}</a><div>`;
					tempText = tempText.replace(match[0], htmlLink);
				}
			}
		}
		if (summary.length > 140) {
			setSummaryError(true);
			badInput = true;
		}

		if (
			newQuestionTags === "" ||
			newQuestionTags.length === 0 ||
			numWords(newQuestionTags) > 5
		) {
			badInput = true;
			setTagsError(true);
		} else {
			for (let i = 0; i < newQuestionTags.length; i++) {
				if (newQuestionTags[i].length > 10) {
					badInput = true;
					setTagsError(true);
				}
			}
		}

		if (!badInput) {
			// turn tags into tag ids
			let incomingTags = newQuestionTags.split(/\s/);
			let tagNames = tags.map((tag) => tag.name);
			const newTags = incomingTags.filter(
				(name) => !tagNames.includes(name)
			);

			for (let i = 0; i < newTags.length; i++) {
				await addTag(newTags[i], tagCount);
				tagCount += 1;
			}
			let allTags = await getAllTags();

			let date = new Date(Date.now());
			const qstnTags = convertTagNamesTo_Ids(allTags, incomingTags);

			let qstn = {
				qid: "q" + (questions.length + 1),
				title: title,
				summary: summary,
				text: tempText,
				tags: qstnTags,
				comments: [],
				answers: [],
				asked_by: users[0].username, //change to grabbing user from session id
				ask_date_time: date,
				views: 0,
				upvotes: 0,
				downvotes: 0,
			};
			qstn._id = id;
			console.log(qstn._id);
			editExistingQuestion(qstn);
			await updateQuestionsFromDatabase();
			setActiveTab(0);
		}
	};

	return (
		<form
			className="askQuestionPage"
			id="askQuestionForm"
			onSubmit={handleSubmit}
		>
			<div id="questionTitle">
				<h2>Question Title*</h2>
				<p>
					<em>Limit title to 50 characters or less</em>
				</p>
				<input
					className="askQuestionInput"
					id="questionTitleInput"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				{titleError && (
					<p style={{ color: "red" }}>
						Title is either too long or empty
					</p>
				)}
			</div>

			<div id="questionSummary">
				<h2>Question Summary*</h2>
				<p>
					<em>Limit summary to 140 characters or less</em>
				</p>
				<input
					className="askQuestionInput"
					id="questionSummaryInput"
					type="text"
					value={summary}
					onChange={(e) => setSummary(e.target.value)}
				/>
				{summaryError && (
					<p style={{ color: "red" }}>Summary is too long</p>
				)}
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

				{textError && (
					<p style={{ color: "red" }}>Text cannot be empty</p>
				)}
				{hyperlinkError && (
					<p style={{ color: "red" }}>Invalid hyperlink format</p>
				)}
			</div>

			<div id="questionTags">
				<h2>Tags*</h2>
				<p>
					<em>Add keywords separated by whitespace</em>
				</p>
				<input
					className="askQuestionInput"
					id="tagsInput"
					type="text"
					value={newQuestionTags}
					onChange={(e) => setNewQuestionTags(e.target.value)}
				/>
				{tagsError && <p style={{ color: "red" }}>Invalid tag input</p>}
			</div>

			<div className="formBottom">
				<input
					id="postQuestionBtn"
					type="submit"
					value="Post Question"
				/>
				<p style={{ color: "red" }}>* indicates mandatory fields</p>
			</div>
		</form>
	);
}

export default EditQuestionPage;
