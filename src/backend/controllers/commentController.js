const Comment = require('../../database/models/comment.js');
const {formatDoc, getDocs, getDoc, postDoc} = require("./generalController");

const commentParams = ["_id", "content", "position", "date", "threadId", "userId"];

exports.getComments = (req, res) => getDocs(req, res, Comment, (results,reqPath) => formatDoc(results, "comment", commentParams, reqPath));

exports.getComment = (req, res) => getDoc(req, res, Comment, (results,reqPath) => formatDoc(results, "comment", commentParams, reqPath))

exports.postComment = (req, res) => postDoc(req, res);
