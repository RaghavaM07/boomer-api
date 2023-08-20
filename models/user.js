const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, '`username` can\'t be empty!'],
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: [true, '`password` can\'t be empty!']
	},
	name: {
		type: String,
		required: [true, '`name` can\'t be empty!']
	}
});

module.exports = mongoose.model('User', userSchema);
