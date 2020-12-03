const { validationResult } = require("express-validator");

exports.validationErrorHandlerFactory = linksFactory => {
	return (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({
				errors: errors.array(),
				links: linksFactory(req)
			});
		}
		next();
	};
};

exports.forceArraySanitizer = (value, { req }) => {
	const sanitized = [];
	if (Array.isArray(value)) {
		value.forEach((item, i) => {
			sanitized.push(item.toString());
		});
	} else {
		sanitized.push(value.toString());
	}
	return sanitized;
};
