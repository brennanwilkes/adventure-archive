//Brennan Wilkes

//Import and setup
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


/**
 * A Schema for a User. User's have a required number _id,
 * and a string name.
 */
const UserSchema = new Schema({
	_id: { type: Number, required: true },
	name: { type: String }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
