const Reaction = require('../models/Reaction');
const Post = require('../models/Post');
const mongoose = require('mongoose');

const reactToPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const author = req.user.userId;
        const type = req.body.type;

        if(!postId) return res.status(400).json({success: false, message: 'Post Id is requied'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});
        if(!type) return res.status(400).json({success: false, message: 'Reaction type is requied'});
        if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({success: false, message: 'Invalid Post ID'});

        const foundPost = await Post.findById(postId);
        if(!foundPost) return res.status(404).json({success: false, message: 'Post not found'});

        const existedReaction = await Reaction.findOne({post: postId, author});

        //Create reaction
        if (!existedReaction) {
            const result = await Reaction.create({post: postId, author, type});
            await Post.findByIdAndUpdate(
                postId,
                {$inc: {
                    reactionCount: 1,
                    [`reactionCounts.${type}`]: 1
                }},
                {new: true}
            );

            return res.status(200).json({success: true, message: 'Create reaction successfully', result});
        }

        //Update reaction
        const oldType = existedReaction.type;
        if (oldType === type) return res.status(200).json({success: false, message: 'You already react this post'});

        existedReaction.type = type;
        await existedReaction.save();
        await Post.findByIdAndUpdate(
            postId,
            {$inc: {
                [`reactionCounts.${oldType}`]: -1,
                [`reactionCounts.${type}`]: 1,
            }}
        );

        return res.status(200).json({success: true, message: 'Update reaction successfully'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const removeReaction = async (req, res) => {
    try {
        const postId = req.params.postId;
        const author = req.user.userId;

        if(!postId) return res.status(400).json({success: false, message: 'Post Id is requied'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});
        if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({success: false, message: 'Invalid post ID'});

        const foundReaction = await Reaction.findOne({post: postId, author});
        if(!foundReaction) return res.status(404).json({success: false, message: 'Reaction not found'});

        const type = foundReaction.type;
        await foundReaction.deleteOne();
        await Post.findByIdAndUpdate(
            postId,
            {$inc: {
                reactionCount: -1,
                [`reactionCounts.${type}`]: -1
            }},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Delete reaction successfully'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const getAllReactionOfPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        if(!postId) return res.status(400).json({success: false, message: 'Post Id is requied'});
        if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({success: false, message: 'Invalid post ID'});

        const foundPost = await Post.findById(postId);
        if(!foundPost) return res.status(404).json({success: false, message: 'Post not found'});

        return res.status(200).json({success: true, message: 'Get all reaction successfully', reactionCount: foundPost.reactionCount, reactionCounts: foundPost.reactionCounts});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = { reactToPost, removeReaction, getAllReactionOfPost };