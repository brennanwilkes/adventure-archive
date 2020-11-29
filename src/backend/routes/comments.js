const rte = require('express').Router();

const {getComments, getComment, postComment} = require("../controllers/commentController");
const {getCommentValidator} = require("../validators/commentValidator");

module.exports = rte.get('/', getCommentValidator, getComments)
					.get('/:id', getComment)
					.post('/', postComment);
