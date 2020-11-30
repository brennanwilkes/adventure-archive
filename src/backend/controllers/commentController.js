const Comment = require('../../database/models/comment.js');
const {formatDoc, getDocs, getDoc, postDoc, buildRegexList, getReqPath} = require("./generalController");

const commentParams = ["_id", "content", "position", "date", "threadId", "userId"];

const buildQuery = req => {
	let query = {};

	if(req.query.thread){
		query.threadId = req.query.thread;
	}
	if(req.query.user){
		query.userId = req.query.user;
	}
	if(req.query.search){
		query.$and = buildRegexList(req.query.search,"content");
	}

	return query;
}

exports.getComments = (req, res) => {
	const query = buildQuery(req);
	if(req.query.groupByThread){

		const limit = (req.query.limit ? parseInt(req.query.limit) : 10)

		Comment.aggregate([
			{$match: query},
			{$group: {
				_id: "$threadId",
				doc: { "$first": "$$ROOT" }
			}},
			{$replaceRoot: {
				newRoot: "$doc"
			}}
		])
		.limit(limit)
		.then(results => {
			res.send(formatDoc(results, "comment", commentParams, getReqPath(req)));
		})
		.catch(error => {
			console.error(error)
			res.status(500);
			res.send(error);
		});

	}
	else{
		return getDocs(req, res, Comment, (results,reqPath) => formatDoc(results, "comment", commentParams, reqPath), query);
	}
};

exports.getComment = (req, res) => getDoc(req, res, Comment, (results,reqPath) => formatDoc(results, "comment", commentParams, reqPath))

exports.postComment = (req, res) => postDoc(req, res);
