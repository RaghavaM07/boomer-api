const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
	shortCode: {
		type: String,
		required: [true, '`shortCode` can\'t be empty!']
	},
	dest: {
		type: String,
		required: [true, '`dest` can\'t be empty!']
	},
	isPrivate: {
		type: Boolean,
		default: false
	},
	creator: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Link', linkSchema);
