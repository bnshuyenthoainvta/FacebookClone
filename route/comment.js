const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:postId', commentController.getAllCommentOfPost);

router.post('/:postId', commentController.createComment);

router.put('/:commentId', commentController.updateComment);

router.post('/:commentId/replies', commentController.repliesComment);

router.delete('/:commentId', commentController.deleteComment);

module.exports = router;