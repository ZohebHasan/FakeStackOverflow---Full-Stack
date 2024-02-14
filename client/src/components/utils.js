import axios from "axios";

export const formattedDateOfQstn = (qstn) => {
	const now = new Date();
	const askDate = new Date(qstn.ask_date_time);
	const timeDiff = now - askDate;

	const seconds = Math.floor(timeDiff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const years = now.getFullYear() - askDate.getFullYear();

	const formattedTime = askDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
	const formattedDate = `${askDate.toLocaleString("default", {
		month: "short",
	})} ${askDate.getDate()}`;

	if (years >= 1) {
		return `${formattedDate}, ${askDate.getFullYear()} at ${formattedTime}`;
	} else if (days >= 1) {
		return `${formattedDate} at ${formattedTime}`;
	} else if (hours >= 1) {
		return `${hours} hours ago`;
	} else if (minutes >= 1) {
		return `${minutes} minutes ago`;
	} else {
		return `${seconds} seconds ago`;
	}
};
export const formattedDateOfAns = (ans) => {
	//console.log(ans)
	const ansDate = new Date(ans.ans_date_time);
	if (isNaN(ansDate.getTime())) {
		return "Invalid date";
	}

	const now = new Date();
	const timeDiff = now - ansDate;

	const seconds = Math.floor(timeDiff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const ansYear = ansDate.getFullYear();

	const formattedTime = ansDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
	const formattedDate = `${ansDate.toLocaleString("default", {
		month: "short",
	})} ${ansDate.getDate()}`;

	if (seconds < 60) {
		return `${seconds} seconds ago`;
	} else if (minutes < 60) {
		return `${minutes} minutes ago`;
	} else if (hours < 24) {
		return `${hours} hours ago`;
	} else if (
		ansYear === now.getFullYear() &&
		ansDate.toDateString() === now.toDateString()
	) {
		return formattedTime;
	} else if (ansYear === now.getFullYear()) {
		return `${formattedDate} at ${formattedTime}`;
	} else {
		return `${formattedDate}, ${ansYear} at ${formattedTime}`;
	}
};

export const isEmpty = (obj) => {
	// Check if the object is not null or undefined
	if (!obj) {
		return true;
	}

	// Check if the object has own properties
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			return false;
		}
	}

	return true;
};

export const addUser = async (user) => {
	await axios
		.post("http://localhost:8000/api/addUser", {
			username: user.username,
			email: user.email,
			password: user.password,
			admin: user.admin,
		})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});
};

export const numWords = (str) => {
	return str.split(/\s+/).length;
};

export const addTag = async (tagName, tagCount) => {
	let newTagId = "t" + (tagCount + 1);

	await axios
		.post("http://localhost:8000/api/addTag", {
			tid: newTagId,
			name: tagName,
		})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});
};

export const convertTagNamesTo_Ids = (allTags, tagNames) => {
	const newTags = [];
	for (let i = 0; i < tagNames.length; i++) {
		newTags[i] = getTag_IdByName(allTags, tagNames[i]);
	}
	return newTags;
};

export const convertAidtoAns_Id = (allAnswers, newAid) => {
	for (let i = 0; i < allAnswers.length; i++) {
		if (allAnswers[i].aid === newAid) {
			return allAnswers[i]._id;
		}
	}
	return -1;
};

export const getTag_IdByName = (allTags, tagName) => {
	for (const tag of allTags) {
		if (tag.name === tagName) {
			return tag._id;
		}
	}
	return -1;
};

export const mapTagNames = (questionTags, allTags) => {
	return questionTags
		.map((tagId) => {
			const tag = allTags.find((t) => t._id === tagId);
			return tag ? tag.name.toLowerCase() : null;
		})
		.filter((name) => name !== null);
}
