const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose = require('mongoose');

const createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const author = req.user.userId;
        const content = req.body.content;

        if(!postId) return res.status(400).json({success: false, message: 'Post ID is required'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});
        if(!content) return res.status(400).json({success: false, message: 'Content is required'});
        if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({success: false, message: 'Invalid Post ID'});

        const foundPost = await Post.findById(postId);
        if(!foundPost) return res.status(404).json({success: false, message: 'Post not found'});

        const result = await Comment.create({post: postId, author, content});

        await Post.findByIdAndUpdate(
            postId,
            {$inc: {commentCount: 1}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Comment create successfully', result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const repliesComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const author = req.user.userId;
        const content = req.body.content;

        if(!commentId) return res.status(400).json({success: false, message: 'Comment ID is required'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});
        if(!content) return res.status(400).json({success: false, message: 'Content is required'});

        if(!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success: false, message: 'Invalid Comment ID'});

        const foundComment = await Comment.findById(commentId);
        if(!foundComment) return res.status(404).json({success: false, message: 'Comment not found'});

        const postId = foundComment.post;
        const result = await Comment.create({post: postId, author, content, parentComment: commentId});

        await Comment.findByIdAndUpdate(
            commentId,
            {$inc: {replyCount: 1}},
            {new: true}
        );

        await Post.findByIdAndUpdate(
            postId,
            {$inc: {commentCount: 1}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Reply Comment successfully', result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const author = req.user.userId;
        const content = req.body.content;

        if(!commentId) return res.status(400).json({success: false, message: 'Comment ID is required'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});
        if(!content) return res.status(400).json({success: false, message: 'Updated content is required'});

        if(!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success: false, message: 'Invalid Comment ID'});

        const foundComment = await Comment.findById(commentId);
        if(!foundComment) return res.status(404).json({success: false, message: 'Comment not found'});

        if(foundComment.author.toString() !== author) return res.status(403).json({success: false, message: 'You can not update this Comment'});

        const result = await Comment.findByIdAndUpdate(
            commentId,
            {$set: {content}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Update Comment successfully', result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const author = req.user.userId;

        if(!commentId) return res.status(400).json({success: false, message: 'Comment ID is required'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});

        if(!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({success: false, message: 'Invalid Comment ID'});

        const foundComment = await Comment.findById(commentId);
        if(!foundComment) return res.status(404).json({success: false, message: 'Comment not found'});
        if(foundComment.author.toString() !== author) return res.status(403).json({success: false, message: 'You can not delete this Comment'});

        const postId = foundComment.post;

        //Delete all child comments recursively
        let substractCommentCount = 1;
        
        async function deleteAllChildComment (commentIdToDelete) {
            const children = await Comment.find({parentComment: commentIdToDelete});

            const ids = children.map(child => child._id);
            substractCommentCount = substractCommentCount + ids.length;
            for(const id of ids) {
                await deleteAllChildComment(id);
            }

            await Comment.deleteMany({_id: {$in: ids}});
        }

        await deleteAllChildComment(commentId);
        await Comment.findByIdAndDelete(commentId);

        //Update commentCound
        await Post.findByIdAndUpdate(
            postId,
            {$inc: {commentCount: -substractCommentCount}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Delete Comment successfully'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const getAllCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const author = req.user.userId;

        if(!postId) return res.status(400).json({success: false, message: 'Post ID is required'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in'});

        if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({success: false, message: 'Invalid Post ID'});

        const foundPost = await Post.findById(postId);
        if(!foundPost) return res.status(404).json({success: false, message: 'Post not found'});
        if(foundPost.author.toString() !== author) return res.status(403).json({success: false, message: 'You can not get all comment of this Post'});

        const result = await Comment.find({post: postId});

        return res.status(200).json({success: true, message: 'Get all comment successfully', commentCount: foundPost.commentCount, result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = { createComment, repliesComment, updateComment, deleteComment, getAllCommentOfPost };