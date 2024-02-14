// Answer Document Schema
const date = new Date(Date.now());
const formattedDate = date.toLocaleString();

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerModelSchema = new Schema({
	text: {
		type: String,
		required: [true, "no text given"],
	},
	ans_by: {
		type: Schema.Types.ObjectId,
		ref: "userModel",
		required: true,
	},
	ans_date_time: {
		type: Date,
		default: formattedDate,
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	votes: {
		type: Number,
		default: 0,
	},
	url: {
		type: String,
		default: "posts/answer/_id",
		immutable: true,
	},
});

const answerModel = mongoose.model("answerModel", answerModelSchema);
module.exports = answerModel;
