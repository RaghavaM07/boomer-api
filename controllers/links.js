const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongoose').Types;

const Link = require('../models/link');

module.exports.redirectController = asyncHandler(async (req, res) => {
	// 1. Get short code
	const shortCode = req.params.shortCode;

	// 2. Get the link mapping
	const link = await Link.findOne({ shortCode, deleted: false });
	if (!link || link.deleted === true) {
		return res.status(404).json({ error: 'SHORT_CODE_DNE' });
	}

	// 3. Check link privacy
	if (link.isPrivate === true) {
		if (!req.user || req.user.id !== link.creator.toString()) {
			return res.status(401).json({ error: 'PRIVATE_LINK' });
		}
	}

	// 4. Redirect to destination
	res.status(302).redirect(link.dest);
});

module.exports.makeLink = asyncHandler(async (req, res) => {
	// 1. Get custom short code, destination, privacy
	const { shortCode, dest, isPrivate } = req.body;
	const creator = req.user.id;

	if (!shortCode || !dest) {
		return res.status(400).json({ error: 'FIELDS_UNSPECIFIED' });
	}

	// 2. Check if link is already in use
	const link = await Link.findOne({ shortCode, deleted: false });
	if (link) {
		return res.status(400).json({ error: 'SHORT_CODE_INUSE' });
	}

	// 3. Create new link
	const newLink = await Link.create({ shortCode, dest, isPrivate, creator: new ObjectId(creator) });
	if (!newLink) {
		return res.status(500).json({ error: 'COULD_NOT_CREATE_LINK' });
	}

	// 4. Return new link
	res.status(201).json({ link: newLink.shortCode });
});

module.exports.deleteLink = asyncHandler(async (req, res) => {
	// 1. Get short code
	const shortCode = req.params.shortCode;

	// 2. Retreive link
	const link = await Link.findOne({ shortCode, deleted: false });
	if (!link) {
		return res.status(404).json({ error: 'SHORT_CODE_DNE' });
	}

	// 3. Verify ownership
	const { creator } = link;
	if (creator.toString() !== req.user.id) {
		return res.status(401).json({ error: 'UNAUTHORIZED' });
	}

	// 4. Delete link
	link.deleted = true;
	const del = await link.save();
	res.status(200).json({ del });
});

module.exports.updateLink = asyncHandler(async (req, res) => {
	// 1. Get short code
	const { shortCode } = req.params;
	if (!shortCode) {
		return res.status(400).json({ error: 'FIELD_UNSPECIFIED' });
	}

	// 2. Retreive link
	const link = await Link.findOne({ shortCode, deleted: false });
	if (!link) {
		return res.status(404).json({ error: 'SHORT_CODE_DNE' });
	}

	// 3. Verify ownership
	const { creator } = link;
	if (creator.toString() !== req.user.id) {
		return res.status(401).json({ error: 'UNAUTHORIZED' });
	}

	// 4. Update link
	let { dest, isPrivate } = req.body;
	if (dest === undefined) dest = link.dest;
	if (isPrivate === undefined) isPrivate = link.isPrivate;
	link.dest = dest;
	link.isPrivate = isPrivate;
	const sav = await link.save();

	res.status(200).json({ sav });
});