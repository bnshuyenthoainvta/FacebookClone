const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:postId/comments/', commentController.createComment);

router.put('/:postId/comments/:commentId', commentController.updateComment);

router.post('/:postId/comments/:comentId/replies', commentController.repliesComment);

router.delete('/:postId/comments/:commentId', commentController.deleteComment);

module.exports = router;