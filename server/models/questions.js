// Question Document Schema
const date = new Date(Date.now());
const formattedDate = date.toLocaleString();

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionModelSchema = new Schema({
	title: {
		type: String,
		requried: [true, "no title given"],
		maxLength: 100,
	},
	text: {
		type: String,
		required: [true, "no text given"],
	},
	summary: {
		type: String,
		required: [true, "no summary given"],
	},
	tags: [String],
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	answers: [
		{
			type: Schema.Types.ObjectId,
			ref: "answerModel",
		},
	],
	asked_by: {
		type: Schema.Types.ObjectId,
		ref: "userModel",
		required: true,
	},
	ask_date_time: {
		type: Date,
		default: formattedDate,
	},
	votes: {
		type: Number,
		default: 0,
	},
	views: {
		type: Number,
		default: 0,
	},
});

const questionModel = mongoose.model("questionModel", questionModelSchema);
module.exports = questionModel;
