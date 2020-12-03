const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
	_id: { type: Number, required: true },
	subforum: { type: String },
	country: { type: String },
	title: { type: String }
});

const Thread = mongoose.model("Thread", ThreadSchema);
module.exports = Thread;
