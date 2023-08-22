const asyncHandler = require('express-async-handler');

const Click = require('../models/click');
const Link = require('../models/link');

const getIpFromRequest = req => {
	let ips = (
		req.headers['cf-connecting-ip'] ||
		req.headers['x-real-ip'] ||
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress || ''
	).split(',');

	return ips[0].trim();
}

const getData = asyncHandler(async (ip) => {
	if (!ip) {
		return { city: 'NA', country: 'NA' };
	}

	const url = `http://ip-api.com/json/${ip}?fields=status,country,city`;

	const response = await fetch(url);
	const jsonResponse = await response.json();
	return jsonResponse;
});

module.exports = asyncHandler(async (req, res, next) => {
	const shortCode = req.params.shortCode;

	const linkId = await Link.findOne({ shortCode }, '_id');
	if (!linkId) {
		next();
		return;
	}

	const ip = getIpFromRequest(req);
	const { city, country } = await getData(ip);

	const clickData = {
		url: linkId._id,
		clicker: req.user?.id,
		ip,
		location: {
			city: city || 'NA',
			country: country || 'NA'
		}
	};
	const click = await Click.create(clickData);

	next();
});
