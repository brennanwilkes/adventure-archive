const User = require('../../database/models/user.js');
const {formatDoc, getDocs, getDoc, postDoc, buildRegexList} = require("./generalController");

const userParams = ["_id", "name"];

const buildQuery = req => {
	let query = {};

	if(req.query.name !== undefined){
		query.$or = buildRegexList(req.query.name,"name");
	}
	return query;
}

exports.getUsers = (req, res) => getDocs(
	req,
	res,
	User,
	(results,reqPath) => formatDoc(results, "user", userParams, reqPath),
	buildQuery(req)
);

exports.getUser = (req, res) => getDoc(req, res, User, (results,reqPath) => formatDoc(results, "user", userParams, reqPath))

exports.postUser = (req, res) => postDoc(req, res);
