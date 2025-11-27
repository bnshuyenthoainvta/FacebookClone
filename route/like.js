const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.put('/:id', likeController.likePost);

router.get('/:id', likeController.getLike);

module.exports = router;