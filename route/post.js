const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getPost);

router.post('/create', postController.createPost);

router.post('/share/:id', postController.sharePost);

router.delete('/delete/:id', postController.deletePost);

module.exports = router;