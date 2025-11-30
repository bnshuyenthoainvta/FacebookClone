const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

const createComment = async (req,res) => {
    try {
        const content = req.body.content;
        const postId = req.params.id;
        const userId = req.user.userID;
        if(!content || !postId || !userId) return res.status(400).json({success:false, message:'Bad request'});

        const user = await User.findById(userId).exec();
        const post = await Post.findById(postId).exec();
        if(!user || !post) return res.status(400).json({success:false, message:'Bad request'});

        const commentId = new mongoose.Types.ObjectId();
        const result = await Comment.create({
            _id: commentId,
            content,
            user: user._id,
            post: post._id
        });

        await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: commentId} }, 
            { new: true }                       
        );

        await User.findByIdAndUpdate(
            userId,
            {$push: {comments: commentId}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Comment created successfully', comment: result});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

const updateComment = async (req,res) => {
    try {
        const commentId = req.params.id;
        const content = req.body.content;
        const userId = req.user.userID;
        if(!content || !commentId || !userId) return res.status(400).json({success:false, message:'Bad request'});

        const foundComment = await Comment.findById(commentId).exec();
        if(!foundComment) return res.status(409).json({success:false, message:'Comment do not exist'});
        if(foundComment.user.toString() !== userId) return res.status(403).json({success:false, message:'Not authorized to update this comment'});

        await foundComment.updateOne({content, updateAt: Date.now()});

        return res.status(200).json({success: true, message:'Comment updated successfully'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

const deleteComment = async (req,res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.userID;
        if(!commentId || !userId) return res.status(400).json({success:false, message:'Bad request'});

        const foundComment = await Comment.findById(commentId).exec();
        if(!foundComment) return res.status(404).json({success:false, message:'Error'});

        if(foundComment.user.toString() !== userId) return res.status(403).json({success:false, message:'Not authorized to delete this comment'});

        await Post.findByIdAndUpdate(
            foundComment.post.toString(),
            {$pull: {comments: foundComment._id}},
            {new: true}
        );

        await User.findByIdAndUpdate(
            foundComment.user.toString(),
            {$pull: {comments: foundComment._id}},
            {new: true}
        );

        await foundComment.deleteOne();
        return res.status(200).json({success: true, message: 'Comment deleted successfully'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = {createComment, updateComment, deleteComment};