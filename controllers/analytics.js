const asyncHandler = require('express-async-handler');

const Link = require('../models/link');
const Click = require('../models/click');

module.exports.getAnalytics = asyncHandler(async (req, res) => {
	const shortCode = req.params.shortCode;
	if (!shortCode) {
		return res.status(400).json({ error: 'SHORTCODE_UNSPECIFIED' });
	}

	const userId = req.user.id;
	const theLink = await Link.findOne({ shortCode, creator: userId });
	if (!theLink) {
		return res.status(400).json({ error: 'SHORTCODE_DNE' });
	}

	const clicks = await Click.getClicks(theLink._id);
	if (clicks === undefined | null) {
		return res.status(500).json({ error: 'COULD_NOT_GET_ANALYTICS' });
	}

	res.status(200).json({ link: theLink, clicks });
});
