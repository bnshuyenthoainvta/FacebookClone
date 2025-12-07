const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

router.get('/:postId', reactionController.getAllReactionOfPost);

router.post('/:postId', reactionController.reactToPost);

router.delete('/:postId', reactionController.removeReaction);

module.exports = router;