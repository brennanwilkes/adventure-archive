const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	_id:{type:Number, required:true},
	subforum:{type:String},
	country:{type:String},
	threadId:{type:Number},
	userId:{type:Number},
	date:{type:String},
	position:{type:String},
	content:{type:String}
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
