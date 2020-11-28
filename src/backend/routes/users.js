const {getUsers, getUser, postUser} = require("../controllers/userController");

const rte = require('express').Router();
module.exports = rte.get('/', getUsers)
					.get('/:id', getUser)
					.post('/', postUser);
