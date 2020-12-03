const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: { type: Number, required: true },
	name: { type: String }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
