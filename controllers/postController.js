const Post = require('../models/Post');

const createPost = async (req,res) => {
    const content = req.body.content;
    const userId = req.user.userID;

    if(!content || !userId) return res.status(400).json({success: false, message: 'Content required'});

    try {
        const result = await Post.create({
            content,
            userId
        });
        return res.status(201).json({success: true, message: `Post created successfully`, post: result});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const getAllPost = async (req,res) => {
    const userId = req.user.userID;
    if(!userId) return res.status(401).json({success: false, message: 'Error'});
    try {
        const listPost = await Post.find({userId});
        if(listPost.length == 0) return res.status(404).json({success: false, message: 'Have no post'});

        return res.status(200).json({success: true, post: listPost});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = {createPost, getAllPost};