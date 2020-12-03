const { query, body } = require("express-validator");
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory, forceArraySanitizer } = require("./generalValidator");

exports.getUserValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self", `${getReqPath(req)}/users?limit=30`)
	]),

	query("name").if(query("name").exists())
		.customSanitizer(forceArraySanitizer)
];

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
