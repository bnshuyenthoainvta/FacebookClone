const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getPost);

router.post('/', postController.createPost);

router.post('/:id/share', postController.sharePost);

router.delete('/:id', postController.deletePost);

module.exports = router;