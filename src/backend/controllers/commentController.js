const Comment = require('../../database/models/comment.js');


const formatCommentData = results => {

	if(!Array.isArray(results)){
		results = [results];
	}

	const json = {};
	json.comments = [];
	for(let i=0;i<results.length;i++){
		json.comments.push({});
		json.comments[i]._id = results[i]._id;
		json.comments[i].content = results[i].content;
		json.comments[i].position = results[i].position;
		json.comments[i].date = results[i].date;
		json.comments[i].threadId = results[i].threadId;
		json.comments[i].userId = results[i].userId;
		json.comments[i].links = [
			{
				rel: "self",
				href: `/comments/${results[i]._id}`,
				action: "GET",
				types:["application/json"]
			},
			{
				rel: "thread",
				href: `/threads/${results[i].threadId}`,
				action: "GET",
				types:["application/json"]
			},
			{
				rel: "user",
				href: `/threads/${results[i].userId}`,
				action: "GET",
				types:["application/json"]
			}
		];
	};

	return json;
}




exports.getComments = (req,res) => {

	Comment.find({})
		.limit(10)
		.then(results => res.send(formatCommentData(results)))
		.catch(error => {
			res.status(500)
			res.send(error);
		});
}
exports.getComment = (req,res) => {

	const json = {};
	Comment.findOne({_id:req.params.id})
		.then(results => {
			if(results.length === 0){
				res.status(404);
				res.send(`Resource ${req.params.id} not found`);
			}
			res.send(formatCommentData(results))})
		.catch(error => {
			res.status(404);
			res.send(`Resource ${req.params.id} not found`);
		});
}
exports.postComment = (req,res) => {
	res.send("todo");
}
