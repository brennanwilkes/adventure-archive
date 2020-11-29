const { check, query, validationResult } = require('express-validator');
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory } = require("./generalValidator");

exports.getUserValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/users`),
		link("self",`${getReqPath(req)}/users?limit=30`),
	])
];
