const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');

const sharePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userID;
        if(!postId || !userId) return res.status(400).json({success:false, message:'Bad request'});

        const foundPost = await Post.findById(postId).exec();
        if(!foundPost) return res.status(404).json({success: false, message: 'Post do not existed'});

        const shareId = new mongoose.Types.ObjectId();

        await Post.findByIdAndUpdate(
            postId,
            {$push: {shares: {_id: shareId, user: userId}}},
            {new: true}
        );

        await User.findByIdAndUpdate(
            userId,
            {$push: {shares: {_id: shareId, post: postId}}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'You had shared this post successfully'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

const unsharePost = async(req,res) => {
    try {
        const shareId = req.params.id;
        const userId = req.user.userID;
        if(!shareId || !userId) return res.status(400).json({success:false, message:'Bad request'});
        const foundUser = await User.findById(userId).exec();
        if(!foundUser) return res.status(400).json({success:false, message:'User not exist'});

        const shareItem = foundUser.shares.find(share => share._id.equals(shareId));
        if(!shareItem) return res.status(404).json({success:false, message:'Share not found'});

        const postId = shareItem.post.toString();

        await User.findByIdAndUpdate(
            userId,
            {$pull: {shares: {_id: shareId}}},
            {new: true}
        );

        await Post.findByIdAndUpdate(
            postId,
            {$pull: {shares: {_id: shareId}}},
            {new: true}
        );

        return res.status(200).json({success: true, message: `Post deleted successfully`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

const getAllShare = async (req, res) => {
    try {
        const shareId = req.params.id;
        const userId = req.user.userID;
        if(!shareId || !userId) return res.status(400).json({success:false, message:'Bad request'});
        const foundUser = await User.findById(userId).populate(
            {    
                path: 'shares.post',
                populate: [
                    {
                        path: 'user', 
                        select: 'username'
                    },
                    {
                        path: 'comments',
                        select: 'content user'
                    }
                ]
            }
        ).exec();

        if(!foundUser) return res.status(400).json({success:false, message:'User not exist'});

        const listSharePost = foundUser.shares.map(share => share.post);
        return res.status(200).json({success: true, share: listSharePost});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

module.exports = {sharePost, unsharePost, getAllShare};