//Brennan Wilkes

//Imports
require("dotenv").config();

const mongoose = require("mongoose");
const mongoDB = `${process.env.DB_CONNECTION}?retryWrites=true&w=majority`;

//Set timeout limit
mongoose.set("maxTimeMS", 25000);

//Export
module.exports.mongoose = mongoose;
module.exports.connection = mongoose.connect(mongoDB, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});
