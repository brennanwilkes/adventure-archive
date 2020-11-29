const User = require('../../database/models/user.js');
const {formatDoc, getDocs, getDoc, postDoc} = require("./generalController");

const userParams = ["_id", "name"];

exports.getUsers = (req, res) => getDocs(req, res, User, results => formatDoc(results, "user", userParams));

exports.getUser = (req, res) => getDoc(req, res, User, results => formatDoc(results, "user", userParams))

exports.postUser = (req, res) => postDoc(req, res);
