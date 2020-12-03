// Brennan Wilkes

// Import and setup
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Thread Schema
 * Threads have a required number _id,
 * a string subforum, a string country,
 * and a string title
 */
const ThreadSchema = new Schema({
	_id: { type: Number, required: true },
	subforum: { type: String },
	country: { type: String },
	title: { type: String }
});

const Thread = mongoose.model("Thread", ThreadSchema);
module.exports = Thread;
