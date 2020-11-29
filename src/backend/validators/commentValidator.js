const { check, query, validationResult } = require('express-validator');
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory } = require("./generalValidator");

exports.getCommentValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments`),
		link("self",`${getReqPath(req)}/comments?limit=30`),
	]),
	query("thread").if(query("thread").exists()).trim().isFloat(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments`),
		link("self",`${getReqPath(req)}/comments?thread=1.2858713569550184e%2B48`),
	])
];
