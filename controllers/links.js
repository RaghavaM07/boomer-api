const asyncHandler = require('express-async-handler');

const Link = require('../models/link');

module.exports.redirectController = asyncHandler(async (req, res) => {
	// 1. Get short code
	const shortCode = req.params.shortCode;

	// 2. Get the link mapping
	const link = await Link.findOne({ shortCode });
	if (!link) {
		return res.status(404).json({ error: 'SHORT_CODE_DNE' });
	}

	// 3. Check link privacy

	// 4. Add analytics

	// 5. Redirect to destination
	res.status(302).redirect(link.dest);
});

module.exports.makeLink = asyncHandler(async (req, res) => {
	// 1. Get custom short code, destination, privacy
	const { shortCode, dest, isPrivate } = req.body;
	if (!shortCode || !dest) {
		return res.status(400).json({ error: 'FIELDS_UNSPECIFIED' });
	}

	// 2. Check if link is already in use
	const link = await Link.findOne({ shortCode });
	if (link) {
		return res.status(400).json({ error: 'SHORT_CODE_INUSE' });
	}

	// 3. Create new link
	const newLink = await Link.create({ shortCode, dest, isPrivate });
	if (!newLink) {
		return res.status(500).json({ error: 'LINK_NOT_CREATED' });
	}

	// 4. Return new link
	res.status(201).json({ link: newLink.shortCode });
});

module.exports.deleteLink = asyncHandler(async (req, res) => {
	// 1. Get short code
	const shortCode = req.params.shortCode;

	// 2. Retreive link
	const link = await Link.findOne({ shortCode });
	if (!link) {
		return res.status(404).json({ error: 'SHORT_CODE_DNE' });
	}

	// 3. Check link creator

	// 4. Delete link
	const del = await Link.deleteOne({ shortCode });
	res.status(200).json({ del });
});

module.exports.updateLink = asyncHandler(async (req, res) => {
	// 1. Get short code
	const { shortCode } = req.params;
	if (!shortCode) {
		return res.status(400).json({ error: 'FIELD_UNSPECIFIED' });
	}

	// 2. Retreive link
	const link = await Link.findOne({ shortCode });
	if (!link) {
		return res.status(404).json({ error: 'SHORT_LINK_DNE' });
	}

	// 3. Verify ownership

	// 4. Update link
	let { dest, isPrivate } = req.body;
	if (dest === undefined) dest = link.dest;
	if (isPrivate === undefined) isPrivate = link.isPrivate;
	link.dest = dest;
	link.isPrivate = isPrivate;
	const sav = await link.save();

	res.status(200).json({ sav });
});