// Brennan Wilkes

// Imports
const User = require("../../database/models/user.js");
const { formatDoc, getDocs, getDoc, postDoc, buildRegexList, hash } = require("./generalController");

/**
 * Expected return params of mongo User
 */
const userParams = ["_id", "name"];

/**
 * Builds a user search query
 * @param {object} req
 * @returns {object} Mongo filter object
 */
const buildQuery = req => {
	const query = {};

	if (req.query.name !== undefined) {
		query.$or = buildRegexList(req.query.name, "name");
	}
	return query;
};

exports.getUsers = (req, res) => getDocs(
	req,
	res,
	User,
	(results, reqPath) => formatDoc(results, "user", userParams, reqPath),
	buildQuery(req)
);

const getUser = (req, res) => getDoc(req, res, User, (results, reqPath) => formatDoc(results, "user", userParams, reqPath));
exports.getUser = getUser;

// Applies additional hash as id
exports.postUser = (req, res) => postDoc(req, res, User, { name: req.body.name }, {
	_id: hash(req.body.name),
	name: req.body.name
}, getUser);
