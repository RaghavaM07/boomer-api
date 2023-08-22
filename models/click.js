const mongoose = require('mongoose');

const Link = require('./link');

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

clickSchema.statics.getClicks = async function (shortCode) {
	const link = Link.findBySC(shortCode);

	const populateOptions = {
		path: 'clicker',
		select: 'username'
	}
	const clicks = this.find({ url: link._id })
		.populate(populateOptions)
		.select('_id createdAt clicker.username');

	return { about: link, clicks };
}

module.exports = mongoose.model('Click', clickSchema);
