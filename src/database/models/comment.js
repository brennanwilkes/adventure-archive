const {mongoose} = require("../connection");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	_id:{type:Number, required:true},
	threadId:{type:Number},
	userId:{type:Number},
	date:{type:String},
	position:{type:String},
	content:{type:String}
});

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
