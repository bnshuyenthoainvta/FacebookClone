const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.put('/:id', likeController.likeAndUnlike);

router.get('/:id', likeController.getAllLike);

module.exports = router;