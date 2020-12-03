const shasum = require("shasum");

const ensureArray = data => (Array.isArray(data) ? data : [data]);
const hash = data => parseInt(shasum(`${data}\n`), 16);
exports.hash = hash;

const link = (rel, href, action = "GET") => {
	return {
		rel: rel,
		href: href,
		action: action,
		types: ["application/json"]
	};
};
exports.link = link;

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

const addLinks = (doc, type, reqPath) => {
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

exports.getDocs = (req, res, Model, formatter, searchQuery = {}, limit = 250) => {
	if (req.query.limit) {
		limit = parseInt(req.query.limit);
	}

	Model.find(searchQuery)
		.limit(limit)
		.then(results => {
			res.send(formatter(results, getReqPath(req)));
		})
		.catch(error => {
			res.status(500).send(error);
		});
};

exports.getDoc = (req, res, Model, formatter) => {
	Model.findOne({ _id: req.params.id })
		.then(results => {
			if (results.length === 0 || results === null) {
				res.status(404);
				res.send(`Resource ${req.params.id} not found`);
			}
			res.send(formatter(results, getReqPath(req)));
		})
		.catch(() => {
			res.status(404);
			res.send(`Resource ${req.params.id} not found`);
		});
};

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

exports.buildRegexList = (params, field) => params.map(q => new RegExp(q, "i")).map(r => {
	const obj = {};
	obj[field] = { $in: [r] };
	return obj;
});
