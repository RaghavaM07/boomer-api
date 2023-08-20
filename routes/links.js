const express = require('express');
const router = express.Router();

const { redirectController, makeLink, deleteLink, updateLink } = require('../controllers/links');
const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/', isLoggedIn, makeLink);
router.get('/:shortCode', redirectController);
router.delete('/:shortCode', isLoggedIn, deleteLink);
router.patch('/:shortCode', isLoggedIn, updateLink);

module.exports = router;