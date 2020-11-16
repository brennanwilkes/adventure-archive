var readline = require("readline");
const connection = require("../database/connection");

var stdInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});


connection.once("open", ()=>{
	stdInterface.prompt();
	stdInterface.on("line", function (cmd) {

	});
});
