// Application server

const express = require("express");
const path = require("path");
const rootDir = path.dirname(__dirname);
const serverPort = 8000;
var cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(express.static(rootDir + "/client/public"));

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(bodyParser.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
	session({
		secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: oneDay,
    		secure: false,
			httpOnly: true,
			sameSite: "lax",
		},
	})
);

app.listen(serverPort, "localhost", () => {
	console.log("listening on port 8000");
});

const mongoose = require("mongoose");

//const Tag = require("./models/tags");
const Answer = require("./models/answers");
const Question = require("./models/questions");
const User = require("./models/users");
const Comment = require("./models/comments");

const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB);
let db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDB connection error:"));

/*function tagCreate(name) {
	let tag = new Tag({ name: name });
	return tag.save();
}*/

async function answerCreate(text, email, ans_date_time) {
    let answerDetail = { text: text };
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error(`No user found with email: ${email}`);
        }

        answerDetail.ans_by = user._id; // Set the user's ID

        if (ans_date_time) {
            answerDetail.ans_date_time = ans_date_time;
        }

        const answer = new Answer(answerDetail);
        return await answer.save();
    } catch (error) {
        // Handle errors (e.g., user not found, database errors)
        console.error(error);
        throw error;
    }
}

function questionCreate(
	title,
	text,
	tags,
	answers,
	asked_by,
	ask_date_time,
	views
) {
	qstndetail = {
		title: title,
		text: text,
		tags: tags,
		asked_by: asked_by,
	};
	if (answers != false) qstndetail.answers = answers;
	if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
	if (views != false) qstndetail.views = views;

	let qstn = new Question(qstndetail);
	return qstn.save();
}

process.on("SIGINT", () => {
	if (db) {
		db.close()
			.then((result) =>
				console.log("Server closed. Database instance disconnected")
			)
			.catch((err) => console.log(err));
	}
	console.log("process terminated");
});

/*app.get("/allTags", (req, res) => {
	//Query the database for all documents in the MyModel collection
	Tag.find()
		.then((docs) => {
			res.send(docs);
		})
		.catch((err) => {
			res.send(err);
		});
	// Send the result back to the client
});*/

app.get("/allQuestions", (req, res) => {
	//Query the database for all documents in the MyModel collection
	Question.find()
		.then((docs) => {
			res.send(docs);
			//console.log(docs);
		})
		.catch((err) => {
			res.send(err);
		});
	// Send the result back to the client
});

app.get("/allAnswers", (req, res) => {
	//Query the database for all documents in the MyModel collection
	Answer.find()
		.then((docs) => {
			res.send(docs);
		})
		.catch((err) => {
			res.send(err);
		});
	// Send the result back to the client
});

app.get("/allUsers", async (req, res) => {
	await User.find()
		.then((docs) => {
			res.send(docs);
		})
		.catch((err) => {
			res.send(err);
		});
});

app.post("/submitAnswer", async (req, res) => {
	const { questionId, text, email, date } = req.body;

	try {
		// Create a new answer
		//console.log("email:",email);
		const newAnswer = await answerCreate(text, email, date);

        await Question.findByIdAndUpdate(
			questionId,
			{ $push: { answers: newAnswer._id } },
			{ new: true, useFindAndModify: false } // options
		);

		res.status(201).json(newAnswer);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.patch("/incrementViews/:questionId", async (req, res) => {
	const { questionId } = req.params;

	try {
		const question = await Question.findById(questionId);
		//question.views++;
		await question.save();
		res.status(200).json(question);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.post("/createQuestion", async (req, res) => {
	const { title, text, tags, asked_by, ask_date_time } = req.body;

	try {
		// Convert tag names to ObjectIds
		/*const tagIds = await Promise.all(
			tags.map(async (tagName) => {
				let tag = await Tag.findOne({ name: tagName });
				if (!tag) {
					// Create a new tag if it doesn't exist
					tag = new Tag({ name: tagName });
					await tag.save();
				}
				return tag._id;
			})
		);*/
		console.log(tags);

		const newQuestion = new Question({
			title,
			text,
			tags: tags,
			asked_by,
			ask_date_time,
		});

		await newQuestion.save();
		res.status(201).json(newQuestion);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error: " + err.message);
	}
});

app.delete("/clearTags", async (req, res) => {
	try {
		await Tag.deleteMany({});
		res.status(200).send("All tags cleared");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.delete("/clearAnswers", async (req, res) => {
	try {
		await Answer.deleteMany({});
		res.status(200).send("All answers cleared");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.delete("/clearQuestions", async (req, res) => {
	try {
		await Question.deleteMany({});
		res.status(200).send("All questions cleared");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.post("/api/addUser", async (req, res) => {
	const { username, email, password, admin } = req.body;
	const newUser = new User({
		username: username,
		email: email,
		password: password,
		admin: admin,
	});

	await newUser
		.save()
		.then(() => {
			res.send("user saved successfully");
		})
		.catch((error) => {
			res.send(error);
		});
});

app.delete("/clearUsers", async (req, res) => {
	try {
		await User.deleteMany({});
		res.status(200).send("All users cleared");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.delete("/clearComments", async (req, res) => {
	try {
		await Comment.deleteMany({});
		res.status(200).send("All comments cleared");
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

/* USER SESSIONS */
app.post("/api/startSession", (req, res) => {
	req.session.user = req.body; // Store the user data in the session
	res.json({
		loggedIn: true,
		message: "Session started successfully",
		user: req.session.user,
	});
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
		// Clear the session data
		if (err) {
			// handle error case...
			console.log(err);
			res.status(500).send("Error logging out");
		} else {
			res.clearCookie("connect.sid", { path: "/" }); // Clear the cookie
			res.json({ loggedIn: false, message: "Logout successful" });
		}
	});
});

app.get("/api/checkSession", (req, res) => {
	if (req.session.user) {
		// Session exists
		res.json({ loggedIn: true, user: req.session.user });
	} else {
		// No active session
		res.json({ loggedIn: false });
	}
});
