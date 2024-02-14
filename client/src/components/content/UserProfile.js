import React from 'react';
import { useGlobalContext } from "../GlobalContext";
import { useMainPageContext } from "../MainPageContext";

function UserProfile() {
  const { activeUser, questions, tags } = useGlobalContext();
  const { setActiveTab, setEditQuestion } = useMainPageContext();

  // Function to map tag IDs to tag names
  const mapTagNamesToTags = (tagIds) => {
    return (tags && tagIds.map(tid => tags.find(tag => tag._id === tid)?.name).join(", ")) || "";
  };

  // Filter questions asked by the active user
  const userQuestions = (questions && activeUser) 
    ? questions.filter(question => question.asked_by === activeUser._id)
    : [];

  return (
    <>
      <div className="userProfileMain">
        <h3>{activeUser?.username}</h3>
        <h3>Reputation: {activeUser.reputation}</h3>
        <h3>Member for: {/* Membership duration logic here */}</h3>
      </div>
      <div className="userProfileQuestions">
        {userQuestions.length > 0 ? userQuestions.map((question, index) => (
          <div key={index} className="userProfileQuestion">
            <button
              className="titlePartOfQstnDisplay"
              onClick={() => {
                // Use the function to get tag names from tag IDs
                question.tags = mapTagNamesToTags(question.tags);
                setEditQuestion(question);
                setActiveTab(9); // Assuming this is the edit tab index
              }}
            >
              {question.title}
            </button>
            {/* Displaying mapped tag names */}
            <div>{mapTagNamesToTags(question.tags)}</div>
          </div>
        )) : <p>No questions to display.</p>}
      </div>
    </>
  );
}

export default UserProfile;
