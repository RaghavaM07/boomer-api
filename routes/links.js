const express = require('express');
const router = express.Router();

const { makeLink, deleteLink, updateLink } = require('../controllers/links');
const { getAnalytics } = require('../controllers/analytics');

const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/', isLoggedIn, makeLink);
router.get('/:shortCode', isLoggedIn, getAnalytics);
router.delete('/:shortCode', isLoggedIn, deleteLink);
router.patch('/:shortCode', isLoggedIn, updateLink);

module.exports = router;