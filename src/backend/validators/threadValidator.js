const { check, query, validationResult } = require('express-validator');
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory, forceArraySanitizer } = require("./generalValidator");

exports.getThreadValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/threads?limit=30`)
	]),
	query("title").if(query("title").exists())
		.customSanitizer(forceArraySanitizer),
	query("country").if(query("country").exists())
		.customSanitizer(forceArraySanitizer),
	query("subforum").if(query("subforum").exists())
		.customSanitizer(forceArraySanitizer)
];
