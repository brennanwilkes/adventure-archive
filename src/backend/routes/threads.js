const rte = require("express").Router();

const { getThreads, getThread, postThread } = require("../controllers/threadController");
const { getThreadValidator } = require("../validators/threadValidator");

module.exports = rte.get("/", getThreadValidator, getThreads)
	.get("/:id", getThread)
	.post("/", postThread);
