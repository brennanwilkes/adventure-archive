const Thread = require('../../database/models/thread.js');
const {formatDoc, getDocs, getDoc, postDoc, buildRegexList} = require("./generalController");

const threadParams = ["_id", "title", "country", "subforum"];

const buildQuery = req => {
	let query = {};

	if(req.query.title || req.query.country || req.query.subforum || req.query.search){
		query.$and = [];
	}
	if(req.query.title){
		query.$and.push({$or:buildRegexList(req.query.title,"title")});
	}
	if(req.query.country){
		query.$and.push({$or:buildRegexList(req.query.country,"country")});
	}
	if(req.query.subforum){
		query.$and.push({$or:buildRegexList(req.query.subforum,"subforum")});
	}

	return query;
}

exports.getThreads = (req, res) => getDocs(
	req,
	res,
	Thread,
	(results,reqPath) => formatDoc(results, "thread", threadParams, reqPath),
	buildQuery(req)
);

exports.getThread = (req, res) => getDoc(req, res, Thread, (results,reqPath) => formatDoc(results, "thread", threadParams, reqPath))

exports.postThread = (req, res) => postDoc(req, res);
