import React, { createContext, useState, useContext } from "react";

// Creating the context
export const MainPageContext = createContext();

export const useMainPageContext = () => useContext(MainPageContext);

export const MainPageProvider = ({ children }) => {
	const [activeTab, setActiveTab] = useState(0);
	const [activeTag, setActiveTag] = useState(null);
	const [activeSort, setActiveSort] = useState(0);
	const [activeQuestionQid, setActiveQuestionQid] = useState(null);
	const [currentSearch, setCurrentSearch] = useState("");
	const [editQuestion, setEditQuestion] = useState(null);

	return (
		<MainPageContext.Provider
			value={{
				currentSearch,
				setCurrentSearch,
				activeTab,
				setActiveTab,
				activeTag,
				setActiveTag,
				activeSort,
				setActiveSort,
				activeQuestionQid,
				setActiveQuestionQid,
				editQuestion,
				setEditQuestion,
			}}
		>
			{children}
		</MainPageContext.Provider>
	);
};
