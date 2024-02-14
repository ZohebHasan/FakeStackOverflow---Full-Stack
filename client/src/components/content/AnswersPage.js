import React, {useEffect} from 'react';
import { formattedDateOfQstn, formattedDateOfAns } from '../utils';
import { useGlobalContext } from '../GlobalContext';
import { useMainPageContext } from '../MainPageContext';

function AnswersPage({
	incrementViews,
}) {
	const {
		questions,
		tags,
		answers,
		users,
		updateAnswersFromDatabase,
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


	const findUsernameWithID = (id) => {
		const user = users.find((user) => user._id === id);
		return user ? user.username : null;
	};

	const question = questions.find((q) => q._id === activeQuestionQid) || -1;
	//console.log(question);
	//console.log(questions)
	let theAnswers = [];
	for (let i = 0; i < question.answers.length; i++)
		theAnswers.push(
			answers.find((a) => a._id === question.answers[i]) || -1
		);
	theAnswers.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
	function handleAnsQues(event) {
		event.preventDefault();
		setActiveTab(4);
	}
	useEffect(() => {
		incrementViews(activeQuestionQid);
	}, [activeQuestionQid, incrementViews]);
	useEffect(() => {
		updateAnswersFromDatabase();
	},[updateAnswersFromDatabase])
	return (
		<div id="answerPage">
			<div className="aPageHeader">
				<div className="aPageHeader-1">
					<h3 id="numAnswers">{question.answers.length} answers</h3>
					<h3 id="qTitle">{question.title}</h3>
					<button
						type="button"
						id="askQuestionBtnAnsrPage"
						className="askQuestionButton"
						onClick={() => setActiveTab(2)}
					>
						{" "}
						Ask Question{" "}
					</button>
				</div>
				<div className="aPageHeader-1">
					<div className="summary">
						<p>{question.summary}</p>
					</div>
					<div className="qTagsContainer">
						{question?.tags.map((tagId, tIndex) => (
							<div
								key={tagId}
								id={tagId}
								className="qTag"
							>
								{tagId}
							</div>
						))}
					</div>
				</div>
				<div className="aPageHeader-2">
					<div className="numViewsContainer">
						<h3 id="numViews">{question.views} views</h3>
					</div>
					<div
						id="qText"
						dangerouslySetInnerHTML={{ __html: question.text }}
					></div>
					<div className="qAskedBy">
						<span id="userAnsrPage">
							{findUsernameWithID(question.asked_by) ||
								question.asked_by}
						</span>
						<span id="dateAnsrPage">
							{" asked " + formattedDateOfQstn(question)}
						</span>
					</div>
				</div>
			</div>
			<div id="aPageAnswers">
				{theAnswers.map((answer, index) => (
					<div className="aPageAnswer" key={index}>
						<div
							id="qText"
							dangerouslySetInnerHTML={{ __html: answer.text }}
						></div>
						<div className="aPageAskedBy">
							<span className="userAnsrPage">
								{findUsernameWithID(answer.ans_by)}
							</span>
							<span className="dateAnsrPage">
								asked {formattedDateOfAns(answer)}
							</span>
						</div>
					</div>
				))}
			</div>
			<button
				id="answerQuestion"
				className="askQuestionButton"
				onClick={handleAnsQues}
			>
				Answer Question
			</button>
		</div>
	);
}

export default AnswersPage;