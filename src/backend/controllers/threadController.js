const Thread = require('../../database/models/thread.js');
const {formatDoc, getDocs, getDoc, postDoc, buildRegexList} = require("./generalController");

const threadParams = ["_id", "title", "country", "subforum"];

const buildQuery = req => {
	let query = {};

	if(req.query.title !== undefined || req.query.country !== undefined || req.query.subforum !== undefined){
		query.$and = [];
	}
	if(req.query.title !== undefined){
		query.$and.push({$or:buildRegexList(req.query.title,"title")});
	}
	if(req.query.country !== undefined){
		query.$and.push({$or:buildRegexList(req.query.country,"country")});
	}
	if(req.query.subforum !== undefined){
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
