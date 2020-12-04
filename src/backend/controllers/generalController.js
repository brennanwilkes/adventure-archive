// Brennan Wilkes

// Imports
const shasum = require("shasum");

/**
 * Wraps data in an array
 * @param {any} data
 * @returns {array}
 */
const ensureArray = data => (Array.isArray(data) ? data : [data]);

/**
 * Hashes a given input using sha256
 * @param {any} data Must be templatable
 * @returns {number} 256bit hash
 */
const hash = data => parseInt(shasum(`${data}\n`), 16);
exports.hash = hash;

/**
 * Generates a link object
 * @param {string} rel Relation
 * @param {string} href URL to route
 * @param {string} action http verb. Defaults to GET
 * @returns {object} Link object
 */
const link = (rel, href, action = "GET") => {
	return {
		rel: rel,
		href: href,
		action: action,
		types: ["application/json"]
	};
};
exports.link = link;

/**
 * Gets a HREF from a request
 * @param {object} req HTTP[s] request
 * @returns {string} HREF
 */
const getReqPath = req => {
	const url = req.baseUrl.split("/");
	/*
		Use:
			`${req.protocol}://${req.headers.host}${url.slice(0,url.length-1).join("/")}`
		for full link URL. Has issues with http/https. Req.protocol always returns HTTP.
	*/
	return `${url.slice(0, url.length - 1).join("/")}`;
};
exports.getReqPath = getReqPath;

/**
 * Adds links to a return document. Mutates @doc.
 * @param {object} doc Document to append to
 * @param {string} type Type of return document (Comment, User, Thread, etc)
 * @param {string} reqPath Path HREF prefix
 */
const addLinks = (doc, type, reqPath) => {
	// Self relation link
	doc.links = [link("self", `${reqPath}/${type}s/${doc._id}`)];

	if (type === "thread") {
		doc.links.push(link("comments by thread", `${reqPath}/comments?thread=${encodeURIComponent(String(doc._id))}`));
		doc.links.push(link("comments by country", `${reqPath}/comments?country=${encodeURIComponent(String(doc.country))}`));
		doc.links.push(link("comments by subforum", `${reqPath}/comments?subforum=${encodeURIComponent(String(doc.subforum))}`));
	} else if (type === "user") {
		doc.links.push(link("comments by user", `${reqPath}/comments?user=${encodeURIComponent(String(doc._id))}`));
		doc.links.push(link("Create new user", `${reqPath}/users`, "POST"));
	} else {
		doc.links.push(link("Post new comment", `${reqPath}/comments`, "POST"));
	}

	if (doc.threadId) {
		doc.links.push(link("thread", `${reqPath}/threads/${doc.threadId}`));
		doc.links.push(link("comments by thread", `${reqPath}/comments?thread=${encodeURIComponent(String(doc.threadId))}`));
	}

	if (doc.userId) {
		doc.links.push(link("user", `${reqPath}/users/${doc.userId}`));
		doc.links.push(link("comments by user", `${reqPath}/comments?user=${encodeURIComponent(String(doc.userId))}`));
	}

	return doc;
};

/**
 * Formats mongoDB results as a JSON document
 * @param {array} results mongoDB query results
 * @param {string} type Type of expected results (Comment, User, Thread)
 * @param {array} params Expected parameters of each document
 * @param {string} reqPath Path prefix to endpoint
 * @returns {object} JSON data to be sent to client
 */
exports.formatDoc = (results, type, params, reqPath) => {
	results = ensureArray(results);

	const json = {};
	json[`${type}s`] = [];
	for (let i = 0; i < results.length; i++) {
		json[`${type}s`].push({});
		params.forEach(p => {
			json[`${type}s`][i][p] = results[i][p];
		});

		json[`${type}s`][i] = addLinks(json[`${type}s`][i], type, reqPath);
	};

	return json;
};

/**
 * General GET route
 * @param {object} req
 * @param {object} res
 * @param {Model} Model MongoDB Schema
 * @param {function} formatter Custom formatter for results
 * @param {object} searchQuery Query to filter by. Defaults to empty
 * @param {number} limit Amount to limit requests by. Defaults to 250
 */
exports.getDocs = (req, res, Model, formatter, searchQuery = {}, limit = 250) => {
	// Apply limit
	if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	// Search database
	Model.find(searchQuery)
		.limit(limit)
		.then(results => {
			res.send(formatter(results, getReqPath(req)));
		})
		.catch(error => {
			res.status(500).send(error);
		});
};

/**
 * General GET route for single document
 * @param {object} req
 * @param {object} res
 * @param {Model} Model MongoDB Schema
 * @param {function} formatter Custom formatter for results
 */
exports.getDoc = (req, res, Model, formatter) => {
	Model.findOne({ _id: req.params.id })
		.then(results => {
			if (results.length === 0 || results === null) {
				res.status(404);
				res.send({ errors: [{ msg: `Resource not found`, value: req.params.id }] });
			}
			res.send(formatter(results, getReqPath(req)));
		})
		.catch(() => {
			res.status(404);
			res.send({ errors: [{ msg: `Resource not found`, value: req.params.id }] });
		});
};

/**
 * General POST route
 * @param {object} req
 * @param {object} res
 * @param {Model} Model MongoDB Schema
 * @param {object} sanitySearch Basic filter to ensure document doesn't already exist
 * @param {object} newData Data to insert
 * @param {function} responseCallback Callback to run to return data. Passed for better abstraction
 */
exports.postDoc = (req, res, Model, sanitySearch, newData, responseCallback) => {
	Model.find(sanitySearch)
		.limit(1)
		.then(results => {
			if (results.length === 0) {
				res.status(201);

				new Model(newData).save().then(response => {
					const reqCopy = req;
					reqCopy.params.id = newData._id;
					responseCallback(reqCopy, res);
				}).catch(error => {
					res.status(500).send(error);
				});
			} else {
				const reqCopy = req;
				reqCopy.params.id = newData._id;
				responseCallback(reqCopy, res);
			}
		})
		.catch(error => {
			res.status(500).send(error);
		});
};

/**
 * Builds a mongo $in filter list with regular expressions
 * @param {array} params Search terms
 * @param {string} field Field to apply search to
 * @returns {object} $in filter pipeline
 */
exports.buildRegexList = (params, field) => params.map(q => new RegExp(q, "i")).map(r => {
	const obj = {};
	obj[field] = { $in: [r] };
	return obj;
});
