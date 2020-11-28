const {getThreads, getThread, postThread} = require("../controllers/threadController");

const rte = require('express').Router();
module.exports = rte.get('/', getThreads)
					.get('/:id', getThread)
					.post('/', postThread);
