import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { formattedDateOfQstn } from "../utils";
import { useGlobalContext } from "../GlobalContext";
import { useMainPageContext } from "../MainPageContext";
import { isEmpty, mapTagNames } from "../utils";

function QuestionsPage() {
	const {
		questions,
		tags,
		answers,
		users,
		setActiveUser,
		activeUser,
		updateUsersFromDatabase,
	} = useGlobalContext();
	const {
		setActiveTab,
		setActiveTag,
		activeTag,
		setActiveSort,
		activeSort,
		setActiveQuestionQid,
		currentSearch,
	} = useMainPageContext();
	const [displayedQuestions, setDisplayedQuestions] = useState(
		questions.slice(0, 5)
	);
	const [allDisplayedQuestions, setAllDisplayedQuestions] = useState([]);
	const [qIndex, setQIndex] = useState(0);
	//console.log(users);
	useEffect(() => {
		updateUsersFromDatabase();
	}, []);

	const getMostRecentAnsDate = useCallback(
		(qid, answers) => {
			const ansIds = questions.find((q) => q._id === qid)?.answers || [];
			let mostRecentAnsDate = null;
			ansIds.forEach((ansId) => {
				const ans = answers.find((a) => a._id === ansId);
				if (
					ans &&
					(!mostRecentAnsDate ||
						new Date(ans.ans_date_time) >
							new Date(mostRecentAnsDate))
				) {
					mostRecentAnsDate = ans.ans_date_time;
				}
			});
			return mostRecentAnsDate;
		},
		[questions]
	);
	console.log(qIndex);
	const handleLastFive = () => {
		if (qIndex - 5 >= 0) {
			console.log("last 5");
			setQIndex((prevQIndex) => Math.max(prevQIndex - 5, 0));
			setDisplayedQuestions(
				allDisplayedQuestions.slice(qIndex - 5, qIndex)
			);
		}
	};

	const handleNextFive = () => {
		if (qIndex + 5 < allDisplayedQuestions.length) {
			console.log("next 5");
			setQIndex((prevQIndex) => prevQIndex + 5);
			setDisplayedQuestions(
				allDisplayedQuestions.slice(qIndex + 5, qIndex + 10)
			);
		}
	};

	const handleTagClick = (event) => {
		event.preventDefault();
		//checkUserSession();
		console.log(users);
		setActiveSort(3);
		setActiveTag(event.target.id);
		setActiveTab(0);
	};

	useEffect(() => {
		let newQuestions;
		if (isEmpty(questions)) {
			return;
		}
		switch (activeSort) {
			case 0: // NEWEST
				newQuestions = [...questions].sort(
					(a, b) =>
						new Date(b.ask_date_time) - new Date(a.ask_date_time)
				);
				break;
			case 1: // ACTIVE
				newQuestions = questions
					.map((question) => {
						const mostRecentAnsDate = getMostRecentAnsDate(
							question._id,
							answers
						);
						return {
							...question,
							sortDate:
								mostRecentAnsDate || question.ask_date_time,
						};
					})
					.sort(
						(a, b) => new Date(b.sortDate) - new Date(a.sortDate)
					);
				break;
			case 2: // UNANSWERED
				newQuestions = questions.filter(
					(question) => question.answers.length === 0
				);
				break;
			case 3: // TAGS
				newQuestions = questions.filter((question) =>
					question.tags.includes(activeTag)
				);
				break;
			case 4: // SEARCH
				const words = currentSearch.trim().toLowerCase().split(/\s+/);
				const results = questions.filter((question) => {
					// Check title and text
					const titleTextMatch = words.some(
						(word) =>
							!word.startsWith("[") &&
							!word.endsWith("]") &&
							(question.title.toLowerCase().includes(word) ||
								question.text.toLowerCase().includes(word))
					);

					// Convert question's tag IDs to names
					const questionTagNames = mapTagNames(question.tags, tags);

					// Check tags
					const tagMatch = words.some((word) => {
						if (word.startsWith("[") && word.endsWith("]")) {
							const searchTagName = word
								.slice(1, -1)
								.toLowerCase();
							return questionTagNames.includes(searchTagName);
						}
						return false;
					});
					return titleTextMatch || tagMatch;
				});
				newQuestions = results;
				break;
			default:
				newQuestions = [...questions];
				break;
		}

		setAllDisplayedQuestions(newQuestions);
		const updatedDisplayedQuestions = newQuestions.slice(
			qIndex,
			qIndex + 6
		);
		setDisplayedQuestions(updatedDisplayedQuestions);
	}, [
		activeSort,
		activeTag,
		answers,
		currentSearch,
		getMostRecentAnsDate,
		questions,
		tags,
		qIndex,
	]);

	const findUsernameWithID = (id) => {
		const user = users.find((user) => user._id === id);
		return user ? user.username : null;
	};

	return (
		<div id="qPage">
			<div className="bodyHeadingContainer">
				<div className="qHeading" id="qHeading1">
					{isEmpty(displayedQuestions) ? (
						<h1 id="questionOrSearch">No Questions Found</h1>
					) : (
						<h1 id="questionOrSearch">All Questions</h1>
					)}
					<button
						className="askQuestionButton"
						id="askQBtn"
						onClick={() => setActiveTab(2)}
					>
						Ask Question
					</button>
				</div>
				<div className="qHeading" id="qHeading2">
					<span id="numQuestions">
						{isEmpty(allDisplayedQuestions)
							? 0
							: allDisplayedQuestions.length}{" "}
						questions
					</span>
					<button
						className="newestSort"
						id="newestSort"
						onClick={() => setActiveSort(0)}
					>
						Newest
					</button>
					<button
						className="activeSort"
						id="activeSort"
						onClick={() => setActiveSort(1)}
					>
						Active
					</button>
					<button
						className="unansweredSort"
						id="unansweredSort"
						onClick={() => setActiveSort(2)}
					>
						Unanswered
					</button>
				</div>
				<div id="qPageQuestions">
					{!isEmpty(displayedQuestions)
						? displayedQuestions.map((question, qIndex) => (
								<div key={qIndex} className="qPageSection">
									<div className="qCounter">
										<span className="ansCounter">
											{question.answers.length} answers
										</span>
										<span className="viewCounter">
											{question.views} views
										</span>
										<button>vote +1</button>
										<br></br>
										<span className="voteCounter">
											{question.votes}
										</span>
										<br></br>
										<button>vote -1</button>
									</div>
									<div className="qTitleTags">
										<button
											className="qTitle"
											id={question._id}
											onClick={() => {
												console.log(
													"Question Clicked: ",
													question._id
												);
												setActiveQuestionQid(
													question._id
												);
												setActiveTab(3);
											}}
										>
											{question.title}
										</button>
										<div className="qSummaryContainer">
											{question.summary}
										</div>
										<div className="qTagsContainer">
											{console.log(question)}
											{question?.tags.map(
												(tagId, tIndex) => (
													<div
														key={tagId}
														id={tagId}
														className="qTag"
														onClick={handleTagClick}
													>
														{tagId}
													</div>
												)
											)}
										</div>
									</div>
									<div className="qUserData">
										<span className="qUser">
											{findUsernameWithID(
												question.asked_by
											) + " "}
										</span>
										<span className="qDate">
											asked{" "}
											{formattedDateOfQstn(question)}
										</span>
									</div>
								</div>
						  ))
						: null}
					<div className="pagination">
						<button
							onClick={handleLastFive}
							className="pageButton prevButton"
						>
							PREV
						</button>
						<button
							onClick={handleNextFive}
							className="pageButton nextButton"
						>
							NEXT
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default QuestionsPage;
