// Brennan Wilkes

// Includes
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Store all backend config vars here
const CONFIG = require(path.join(__dirname, "..", "..", "config", "backend.json"));
exports.CONFIG = CONFIG;

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
const print = (...content) => {
	if (CONFIG.verbose) console.log(...content);
};
exports.print = print;

/**
	Server abstration object
	@class
*/
exports.server = {

	/**
		Port to use. Defaults to a "PORT" env variable if set (For heroku and other deployment methods),
		otherwise uses the port set in the config file. Defaults to 8080.
		@type {number}
	*/
	port: process.env.PORT || CONFIG.port || 8080,

	/**
		Express init object
		@type {object}
	*/
	app: express(),

	/**
		Basic express setup.
		Sets JSON encoding, url encoded bodies and static routing.
		Sets up routes from API config
	*/
	init () {
		// support json encoded bodies
		this.app.use(express.json());

		// support encoded bodies
		this.app.use(bodyParser.urlencoded({ extended: true }));

		// Static routing for public files
		this.app.use("/", express.static(path.join(__dirname, "..", "..", "public-frontend")));

		// API routing
		CONFIG.api.forEach((api, i) => {
			const apiRouter = require(`./${api.path}`);
			if (api.default) {
				this.app.use("/api", apiRouter);
			}
			this.app.use(`/api/v${api.version}`, apiRouter);
			print(`Created API route v${api.version}`);
		});
	},

	/**
		Starts the webserver.
		This method should be run last, after init and routing.
	*/
	start () {
		// 404 messages
		this.app.get("*", (req, res) => {
			print("Received invalid GET request for", req.url);

			res.writeHead(404, { "Content-Type": "text/html" });
			res.write("<h1>404: If you see this, it's already too late!</h1>");
			res.end();
		});

		// Socket init
		this.server = this.app.listen(this.port, () => {
			print("server is listening on port", this.server.address().port);
		});
	},

	/**
	 * Closes socket connection
	 */
	close () {
		this.server.close();
	}
};
