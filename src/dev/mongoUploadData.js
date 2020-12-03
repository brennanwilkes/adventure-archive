//Brennan Wilkes

const readline = require("readline");

console.log("connecting to mongo");
const { connection, mongoose } = require("../database/connection");
const Comment = require("../database/models/comment");
const Thread = require("../database/models/thread");
const User = require("../database/models/user");

const stdInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

function prerr (err, docs) {
	if (err) {
		console.error(err);
	}
}

function upsertData (Model, filter, data) {
	Model.updateOne(
		filter,
		data,
		{ upsert: true },
		prerr);
}

function uploadData (data) {
	data = data.split("<>DELIM<>");

	if (data[4] === undefined) {
		console.error("Failed to upload forum. Data Recieved:");
		console.error(data[0].substring(0, 100));
		return;
	}

	upsertData(
		Comment,
		{ _id: parseInt(data[4], 16) },
		{
			threadId: parseInt(data[3], 16),
			userId: parseInt(data[5], 16),
			date: data[7],
			position: data[8],
			content: data[9]
		});

	upsertData(
		User,
		{ _id: parseInt(data[5], 16) },
		{ name: data[6] });

	upsertData(
		Thread,
		{ _id: parseInt(data[3], 16) },
		{
			subforum: data[0],
			country: data[1],
			title: data[2]
		});

	// Mongoose has memory leaks :(
	delete mongoose.models.User;
	delete mongoose.models.Thread;
	delete mongoose.models.Comment;
	delete connection.collections.users;
	delete connection.collections.threads;
	delete connection.collections.comments;
	delete mongoose.modelSchemas.User;
	delete mongoose.modelSchemas.Thread;
	delete mongoose.modelSchemas.Comment;
}

function onDbLoad () {
	console.log("Reading STDIN");
	stdInterface.prompt();
	stdInterface.on("line", uploadData);
}

connection.once("open", onDbLoad);
