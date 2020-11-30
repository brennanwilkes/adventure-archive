const User = require('../../database/models/user.js');
const {formatDoc, getDocs, getDoc, postDoc} = require("./generalController");

const userParams = ["_id", "name"];

const buildQuery = req => {
	let query = {};

	if(req.query.name !== undefined){
		query.$or = req.query.name.map(
						q => new RegExp(q)
					).map(
						r => {
							return {name:{$in : r}}
						});
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
