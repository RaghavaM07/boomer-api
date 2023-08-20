const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(403).json({ error: 'TOKEN_UNSPECIFIED' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);

		const { id, username } = decoded;
		req.user = { id, username };
	} catch (err) {
		return res.status(400).json({ error: 'TOKEN_INVALID' });
	}

	next();
});
