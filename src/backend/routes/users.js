// Brennan Wilkes

// Imports
const rte = require("express").Router();
const { getUsers, getUser, postUser } = require("../controllers/userController");
const { getUserValidator, postUserValidator } = require("../validators/userValidator");

// User routing
module.exports = rte.get("/", getUserValidator, getUsers)
	.get("/:id", getUser)
	.post("/", postUserValidator, postUser);
