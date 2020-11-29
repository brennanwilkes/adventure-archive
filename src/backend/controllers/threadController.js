const Thread = require('../../database/models/thread.js');


const formatThreadData = results => {

	if(!Array.isArray(results)){
		results = [results];
	}

	const json = {};
	json.threads = [];
	for(let i=0;i<results.length;i++){
		json.threads.push({});
		json.threads[i]._id = results[i]._id;
		json.threads[i].title = results[i].title;
		json.threads[i].country = results[i].country;
		json.threads[i].subforum = results[i].subforum;
		json.threads[i].links = [
			{
				rel: "self",
				href: `/threads/${results[i]._id}`,
				action: "GET",
				types:["application/json"]
			}
		];
	};
	return json;
}




exports.getThreads = (req,res) => {

	Thread.find({})
		.limit(100)
		.then(results => res.send(formatThreadData(results)))
		.catch(error => {
			res.status(500)
			res.send(error);
		});
}
exports.getThread = (req,res) => {

	const json = {};
	Thread.findOne({_id:req.params.id})
		.then(results => {
			if(results.length === 0){
				res.status(404);
				res.send(`Resource ${req.params.id} not found`);
			}
			res.send(formatThreadData(results))})
		.catch(error => {
			res.status(404);
			res.send(`Resource ${req.params.id} not found`);
		});
}
exports.postThread = (req,res) => {
	res.send("todo");
}
