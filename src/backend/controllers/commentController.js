const Comment = require('../../database/models/comment.js');
const {formatDoc, getDocs, getDoc, postDoc, buildRegexList} = require("./generalController");

const commentParams = ["_id", "content", "position", "date", "threadId", "userId"];

const buildQuery = req => {
	let query = {};

	if(req.query.thread !== undefined){
		query.threadId = req.query.thread;
	}
	if(req.query.user !== undefined){
		query.userId = req.query.user;
	}
	if(req.query.search !== undefined){
		query.$and = buildRegexList(req.query.search,"content");
	}
	return query;
}

exports.getComments = (req, res) => getDocs(
	req,
	res,
	Comment,
	(results,reqPath) => formatDoc(results, "comment", commentParams, reqPath),
	buildQuery(req)
);

exports.getComment = (req, res) => getDoc(req, res, Comment, (results,reqPath) => formatDoc(results, "comment", commentParams, reqPath))

exports.postComment = (req, res) => postDoc(req, res);
