const Comment = require('../../database/models/comment.js');
const {formatDoc, getDocs, getDoc, postDoc} = require("./generalController");

const commentParams = ["_id", "content", "position", "date", "threadId", "userId"];

exports.getComments = (req, res) => getDocs(req, res, Comment, results => formatDoc(results, "comment", commentParams));

exports.getComment = (req, res) => getDoc(req, res, Comment, results => formatDoc(results, "comment", commentParams))

exports.postComment = (req, res) => postDoc(req, res);
