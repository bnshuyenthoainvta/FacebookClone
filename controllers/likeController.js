const Post = require('../models/Post');

const likePost = async(req,res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userID;
        if(!postId || !userId) return res.status(400).json({success: false, message: 'Error'});

        const foundPost = await Post.findById(postId).exec();
        if(!foundPost) return res.status(400).json({success: false, message: 'Error'});

        const foundLike = foundPost.likes.includes(userId);
        if(foundLike) {
            await Post.findByIdAndUpdate(
                postId,
                {$pull: {likes: userId}},
                {new: true}
            )
            return res.status(200).json({success: true, message: 'you unlike post successfully'});
        };

        await Post.findByIdAndUpdate(
            postId,
            {$push: {likes: {userId}}},
            {new: true}
        );

        return res.status(200).json({success: true, message: 'Like successfully'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const getLike = async(req,res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userID;
        if(!postId || !userId) return res.status(400).json({success: false, message: 'Error'});

        const foundPost = await Post.findById(postId).exec();
        if(!foundPost) res.status(400).json({success: false, message: 'Error'});

        const numberLike = foundPost.likes.length;
        return res.status(200).json({success: true, message: `Số lượt like: ${numberLike}`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = { likePost, getLike };