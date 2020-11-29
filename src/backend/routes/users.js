const rte = require('express').Router();

const {getUsers, getUser, postUser} = require("../controllers/userController");
const {getUserValidator} = require("../validators/userValidator");

module.exports = rte.get('/', getUserValidator, getUsers)
					.get('/:id', getUser)
					.post('/', postUser);
