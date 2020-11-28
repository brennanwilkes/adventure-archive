const {getComments, getComment, postComment} = require("../controllers/commentController");

const rte = require('express').Router();
module.exports = rte.get('/', getComments)
					.get('/:id', getComment)
					.post('/', postComment);
