const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getPost);

router.post('/', postController.createPost);

router.post('/:postId/share', postController.sharePost);

router.delete('/:postId', postController.deletePost);

module.exports = router;