const User = require('../../database/models/user.js');


const formatUserData = results => {

	if(!Array.isArray(results)){
		results = [results];
	}

	const json = {};
	json.users = [];
	for(let i=0;i<results.length;i++){
		json.users.push({});
		json.users[i]._id = results[i]._id;
		json.users[i].name = results[i].name;
		json.users[i].links = [
			{
				rel: "self",
				href: `/users/${results[i]._id}`,
				action: "GET",
				types:["application/json"]
			}
		];
	};

	return json;
}




exports.getUsers = (req,res) => {

	User.find({})
		.limit(100)
		.then(results => res.send(formatUserData(results)))
		.catch(error => {
			res.status(500)
			res.send(error);
		});
}
exports.getUser = (req,res) => {

	const json = {};
	User.findOne({_id:req.params.id})
		.then(results => {
			if(results.length === 0){
				res.status(404);
				res.send(`Resource ${req.params.id} not found`);
			}
			res.send(formatUserData(results))})
		.catch(error => {
			res.status(404);
			res.send(`Resource ${req.params.id} not found`);
		});
}
exports.postUser = (req,res) => {
	res.send("todo");
}
