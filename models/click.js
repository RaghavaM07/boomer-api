const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
	url: {
		type: mongoose.Types.ObjectId,
		ref: 'Link',
		required: [true, '`shortCode` can\'t be empty!']
	},
	clicker: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		default: null
	},
	ip: {
		type: String
	},
	location: {
		city: {
			type: String
		},
		country: {
			type: String
		}
	}
}, { timestamps: true });


clickSchema.virtual('clickedAt').get(function () {
	return this.createdAt;
});

clickSchema.statics.getClicks = async function (linkId) {
	const populateOptions = {
		path: 'clicker',
		select: 'username -_id'
	}
	const clicks = this.find({ url: linkId })
		.populate(populateOptions)
		.select('_id createdAt clicker ip location');

	return clicks;
}

module.exports = mongoose.model('Click', clickSchema);
