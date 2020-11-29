const { check, query, validationResult } = require('express-validator');
const { validationErrorHandlerFactory } = require("./generalValidator");

exports.getThreadValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/threads`),
		link("self",`${getReqPath(req)}/threads?limit=30`),
	])
];
