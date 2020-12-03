// Brennan Wilkes

// Imports
const { validationResult } = require("express-validator");

/**
 * Generates a validation error and returns a 422 code
 * @param {function} linksFactory Link generator which produces the HATEOAS links array in the error message
 */
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

/**
 * Forces a parameter to be an array of strings
 * @param {any} value Value to sanitize
 * @param {object} req
 */
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
