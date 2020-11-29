const Comment = require('../../database/models/comment.js');

const ensureArray = data => (Array.isArray(data) ? data : [data]);

const link = (rel,href) => {
	return {
		rel: rel,
		href: href,
		action: "GET",
		types:["application/json"]
	}
}

const getReqPath = req => {
	const url = req.baseUrl.split("/");
	return `${req.headers.host}${url.slice(0,url.length-1).join("/")}`;
}


const addLinks = (doc,type, reqPath) => {

	doc.links = [link("self",`${reqPath}/${type}s/${doc._id}`)];

	if(doc.threadId){
		doc.links.push(link("thread",`${reqPath}/threads/${doc.threadId}`));
	}

	if(doc.userId){
		doc.links.push(link("user",`${reqPath}/users/${doc.userId}`));
	}

	return doc;
}



exports.formatDoc = (results, type, params, reqPath) => {

	results = ensureArray(results);

	const json = {};
	json[`${type}s`] = [];
	for(let i=0;i<results.length;i++){

		json[`${type}s`].push({});
		params.forEach(p => {
			json[`${type}s`][i][p] = results[i][p];
		});

		json[`${type}s`][i] = addLinks(json[`${type}s`][i],type, reqPath);

	};

	return json;
}

exports.getDocs = (req, res, Model, formatter, limit=2) => {

	console.log(req.headers.host)
	console.log(req.baseUrl)


	Model.find({})
		.limit(limit)
		.then(results => {
			res.send(formatter(results,getReqPath(req)));
		})
		.catch(error => {
			res.status(500);
			res.send(error);
		});
}


exports.getDoc = (req, res, Model, formatter) => {

	Model.findOne({_id:req.params.id})
		.then(results => {
			if(results.length === 0){
				res.status(404);
				res.send(`Resource ${req.params.id} not found`);
			}
			res.send(formatter(results,getReqPath(req)))})
		.catch(error => {
			res.status(404);
			res.send(`Resource ${req.params.id} not found`);
		});
}
exports.postDoc = (req,res) => {
	res.send("todo");
}
