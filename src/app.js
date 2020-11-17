const path = require("path");
const {server} = require(path.join(__dirname,"backend","server.js"));

server.init();

//routing

server.start();
