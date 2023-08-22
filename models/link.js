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
	},
	deleted: {
		type: Boolean,
		default: false
	}
});

linkSchema.statics.findBySC = function (shortCode) {
	const returnVal = this.findOne({ shortCode });
	if (!returnVal || returnVal.deleted === true) return null;
	return returnVal;
}

module.exports = mongoose.model('Link', linkSchema);
