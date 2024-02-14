const date = new Date(Date.now());
const formattedDate = date.toLocaleString();

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModelSchema = new Schema({
	username: {
		type: String,
		required: [true, "no username given"],
	},
	email: {
		type: String,
		required: [true, "no email given"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "no password given"],
	},
	reputation: {
		type: Number,
		default: 0,
	},
	accountCreationDate: {
		type: Date,
		default: formattedDate,
	},
	
	admin: {
		type: Boolean,
		default: false,
	},
});

const userModel = mongoose.model("userModel", userModelSchema);
module.exports = userModel;
