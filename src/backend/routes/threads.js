// Brennan Wilkes

// Imports
const rte = require("express").Router();
const { getThreads, getThread } = require("../controllers/threadController");
const { getThreadValidator } = require("../validators/threadValidator");

// Thread routing
module.exports = rte.get("/", getThreadValidator, getThreads)
	.get("/:id", getThread);
