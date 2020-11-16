var readline = require("readline");


console.log("connecting to mongo")
const connection = require("../database/connection");

const stdInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});


connection.once("open", () => {
	console.log("Reading STDIN")
	stdInterface.prompt();
	stdInterface.on("line", data => {
		data = data.split("<>DELIM<>");
		console.log(data)
	});
});
