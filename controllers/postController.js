const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req,res) => {
    const content = req.body.content;
    const userId = req.user.userID;

    if(!content || !userId) return res.status(400).json({success: false, message: 'Content required'});

    try {
        const user = await User.findById(userId).exec();
        if(!user) return res.status(404).json({success: false, message: 'User not found'});

        const result = await Post.create({
            content,
            user: user._id
        });

        await User.findByIdAndUpdate(
            userId,
            {$push: {posts: result._id}},
            {new: true}
        );

        return res.status(201).json({success: true, message: `Post created successfully`, post: result});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const updatePost = async(req,res) => {
    const postId = req.params.id;
    const content = req.body.content;
    const userId = req.user.userID;

    if(!content || !userId || !postId) return res.status(400).json({success: false, message: 'Content required'});

    try {
        const foundPost = await Post.findById(postId).exec();
        if(!foundPost || foundPost.user.toString() !== userId) return res.status(404).json({success: false, message: 'Update post get Error'});

        const result = await Post.findByIdAndUpdate(
            postId,
            {$set: 
                {
                content: content,
                updatedAt: Date.now()
                }
            },
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Post  updated successfully', result});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const deletePost = async(req,res) => {
    const postId = req.params.id;
    const userId = req.user.userID;

    if(!userId || !postId) return res.status(403).json({success: false, message: 'Error'});

    try {
        const foundPost = await Post.findById(postId).exec();
        if(!foundPost || foundPost.user.toString() !== userId) return res.status(404).json({success: false, message: 'Delete post get error'});

        await User.findByIdAndUpdate(
            userId,
            {$pull: {posts: foundPost._id}},
            {new: true}
        );
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({success: true, message: 'Post  deleted successfully'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

const getAllPost = async (req,res) => {
    const userId = req.user.userID;
    if(!userId) return res.status(401).json({success: false, message: 'Error'});
    try {
        const foundUser = await User.findById(userId).populate({
            path: 'posts',
            populate: [
                {path: 'user', select: 'username'},
                {
                    path: 'comments',
                    populate: { path: 'user', select: 'username' }
                }
            ]
        }).exec();
        if(!foundUser) return res.status(404).json({success: false, message: 'User not found'});
        const listPost = foundUser.posts;
        if(listPost.length == 0) return res.status(404).json({success: false, message: 'Have no post'});

        return res.status(200).json({success: true, post: listPost});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = {createPost, updatePost, getAllPost, deletePost};