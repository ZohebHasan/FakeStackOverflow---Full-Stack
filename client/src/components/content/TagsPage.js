import { useGlobalContext } from "../GlobalContext";
import { useMainPageContext } from "../MainPageContext";
import { isEmpty } from "../utils";

function TagsPage() {
	const {
		questions,
	} = useGlobalContext();
	const {
		setActiveTab,
		setActiveTag,
		setActiveSort,
	} = useMainPageContext();
	const handleTagClick = (event) => {
		event.preventDefault();
		setActiveSort(3);
		setActiveTag(event.target.id);
		setActiveTab(0);
	};
	console.log(questions)
	const allTags = questions.map(question => question.tags).flat();
	const tags = [...new Set(allTags)];

	return (
		<div id="tPage">
			<div className="tagHeader">
				<h3>{isEmpty(tags) ? 0 : tags.length} Tags</h3>
				<h3>All Tags</h3>
				<button
					type="button"
					className="askQuestionButton"
					id="askQuestionBtnInTag"
					onClick={() => setActiveTab(2)}
				>
					{" "}
					Ask Question{" "}
				</button>
			</div>
			<div className="tagContainerRow">
				{!isEmpty(tags) &&
					tags.map((tag, tIndex) => (
						<div
							className="tagContainer"
							key={tag}
							id={tag}
							onClick={handleTagClick}
						>
							<div className="tagText">
								<a href="/" className="tagLink">
									{tag}
								</a>
								<p className="tagText">
									{
										questions.filter((question) =>
											question.tags.includes(tag)
										).length
									}{" "}
									questions
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

export default TagsPage;
