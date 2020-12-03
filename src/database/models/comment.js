//Brennan Wilkes

//Import and setup
const { mongoose } = require("../connection");
const Schema = mongoose.Schema;


/**
 * Comment Schema. Comments have a required number _id,
 * a number threadId, a number userId, and string date,
 * a string position, and a string content
 */
const CommentSchema = new Schema({
	_id: { type: Number, required: true },
	threadId: { type: Number },
	userId: { type: Number },
	date: { type: String },
	position: { type: String },
	content: { type: String }
});

const Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;
