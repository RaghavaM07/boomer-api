const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/user');

module.exports.register = asyncHandler(async (req, res) => {
	const { name, username, password: pwd } = req.body;
	if (!name || !username || !pwd) {
		return res.status(400).json({ error: 'FIELDS_UNSPECIFIED' });
	}

	const dupUsername = await User.find({ username });
	if (dupUsername.length !== 0) {
		return res.status(400).json({ error: 'USERNAME_INUSE' });
	}

	const password = await bcrypt.hash(pwd, 10);

	const user = User.create({ username, password, name });
	if (!user) {
		return res.status(500).json({ error: 'COULD_NOT_CREATE_USER' });
	}

	res.status(201).json({ username });
});

module.exports.login = asyncHandler(async (req, res) => {
	const { username, password: pwd } = req.body;

	const user = await User.findOne({ username })
	if (!user) {
		return res.status(400).json({ error: 'USERNAME_INVALID' });
	}

	const isOk = await bcrypt.compare(pwd, user.password);
	if (!isOk) {
		return res.status(400).json({ error: 'PASSWORD_INVALID' })
	}

	const token = jwt.sign({ id: user._id, username, name: user.name }, process.env.JWT_SECRET, {});

	res.status(200).json({ token });
});
