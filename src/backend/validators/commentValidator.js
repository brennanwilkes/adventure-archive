const { check, query, body, validationResult } = require('express-validator');
const { link, getReqPath } = require("../controllers/generalController");
const { validationErrorHandlerFactory, forceArraySanitizer } = require("./generalValidator");
const Thread = require('../../database/models/thread.js');
const User = require('../../database/models/user.js');

exports.getCommentValidator = [
	query("limit").if(query("limit").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments?limit=30`)
	]),

	query("random").if(query("random").exists()).trim().isInt(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments?random=30`)
	]),

	query("thread").if(query("thread").exists()).trim().isFloat(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments?thread=1.2858713569550184e%2B48`)
	]),

	query("user").if(query("user").exists()).trim().isFloat(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments?user=9.813252315982051e%2B47`)
	]),

	query("search").if(query("search").exists())
		.customSanitizer(forceArraySanitizer),

	query("country").if(query("country").exists())
		.customSanitizer(forceArraySanitizer),

	query("subforum").if(query("subforum").exists())
		.customSanitizer(forceArraySanitizer),

	query("groupByThread").if(query("groupByThread").exists()).trim().isBoolean(),
	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments?groupByThread=true`)
	])
];

exports.postCommentValidator = [
	body("user")
		.isString()
		.trim()
		.isAscii()
		.isLength({min:1})
		.escape()
		.custom((user, {req}) => User.findOne({name:user}).limit(1).then(result => {
			if(!result || result.length < 0) {
				return Promise.reject('User does not exist');
			}
			return Promise.resolve()
		})),

	body("comment")
		.isString()
		.trim()
		.isAscii()
		.isLength({min:1})
		.escape(),

	body("threadId")
		.isString()
		.trim()
		.isLength({min:1})
		.custom((id, {req}) => Thread.findOne({_id:id}).limit(1).then(result => {
			if(!result || result.length < 0) {
				return Promise.reject('Thread does not exist');
			}
			return Promise.resolve()
		})),


	validationErrorHandlerFactory(req => [
		link("self",`${getReqPath(req)}/comments`,"POST")
	])
]
