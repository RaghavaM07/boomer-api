const express = require('express');
const router = express.Router();
const { redirectController, makeLink, deleteLink, updateLink } = require('../controllers/links');

router.post('/', makeLink);
router.get('/:shortCode', redirectController);
router.delete('/:shortCode', deleteLink);
router.patch('/:shortCode', updateLink);

module.exports = router;