const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.put('/create', postController.createPost);

router.get('/:id', postController.getAllPost);

module.exports = router;