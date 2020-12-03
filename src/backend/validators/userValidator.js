// Brennan Wilkes

// Imports
const { query, body } = require("express-validator");
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory, forceArraySanitizer } = require("./generalValidator");

/**
 * Validation for GET requests on /users
 * Checks validity of optional parameters
 */
exports.getUserValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self", `${getReqPath(req)}/users?limit=30`)
	]),

	query("name").if(query("name").exists())
		.customSanitizer(forceArraySanitizer)
];

/**
 * Validation for POST requests on /users
 * Ensures a name is provided that is a string of ascii characters,
 * and has a minimum length of 1.
 */
exports.postUserValidator = [
	body("name")
		.isString()
		.trim()
		.isAscii()
		.isLength({ min: 1 }),
	validationErrorHandlerFactory(req => [
		link("self", `${getReqPath(req)}/users`, "POST")
	])

];
