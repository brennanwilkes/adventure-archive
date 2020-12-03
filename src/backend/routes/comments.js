// Brennan Wilkes

// Imports
const rte = require("express").Router();
const { getComments, getComment, postComment } = require("../controllers/commentController");
const { getCommentValidator, postCommentValidator } = require("../validators/commentValidator");

// Comment routing
module.exports = rte.get("/", getCommentValidator, getComments)
	.get("/:id", getComment)
	.post("/", postCommentValidator, postComment);
