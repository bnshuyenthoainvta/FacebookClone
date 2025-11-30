const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.get('/:id', shareController.sharePost);

router.delete('/:id', shareController.unsharePost);

router.get('/:id', shareController.getAllShare);

module.exports = router;