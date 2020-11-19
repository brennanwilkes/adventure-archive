require('dotenv').config();

const mongoose = require('mongoose');
const mongoDB = process.env.DB_CONNECTION;
mongoose.connect(mongoDB, { useMongoClient:true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.connection = connection;
module.exports.mongoose = mongoose;
