const { check, query, validationResult } = require('express-validator');
const { link, getReqPath } = require("../controllers/generalController");

exports.validationErrorHandlerFactory = linksFactory => {
	return (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()){
			return res.status(422).json({
				errors: errors.array(),
				links: linksFactory(req)
			});
		}
		next();
	}
}
