// Brennan Wilkes

// Imports
const { query } = require("express-validator");
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory, forceArraySanitizer } = require("./generalValidator");

/**
 * Validates a GET request for /threads
 * Checks all optional parameters for validity and returns the correct error responses
 */
exports.getThreadValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self", `${getReqPath(req)}/threads?limit=30`)
	]),
	query("title").if(query("title").exists())
		.customSanitizer(forceArraySanitizer),
	query("country").if(query("country").exists())
		.customSanitizer(forceArraySanitizer),
	query("subforum").if(query("subforum").exists())
		.customSanitizer(forceArraySanitizer)
];
