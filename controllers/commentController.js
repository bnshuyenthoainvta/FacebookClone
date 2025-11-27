const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req,res) => {
    try {
        const content = req.body.content;
        const postId = req.params.id;
        const userId = req.user.userID;
        if(!content || !postId || !userId) return res.status(400).json({success:false, message:'Error'});

        const result = await Comment.create({
            content,
            postId,
            userId
        });

        const foundPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: result.id } }, 
            { new: true }                       
        );

        return res.status(200).json({success: true, message: 'Comment created successfully', comment: result, post: foundPost});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
};

const deleteComment = async (req,res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.userID;
        if(!commentId || !userId) return res.status(400).json({success:false, message:'Error'});

        const foundComment = await Comment.findById(commentId).exec();
        if(!foundComment) return res.status(404).json({success:false, message:'Error'});

        if(foundComment.userId.toString() !== userId) return res.status(403).json({success:false, message:'Not authorized to delete this comment'});

        await Post.findByIdAndUpdate(
            foundComment.postId,
            {$pull: {comments: foundComment.id}},
            {new: true}
        );

        await foundComment.deleteOne();
        return res.status(200).json({success: true, message: 'Comment deleted successfully'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = {createComment, deleteComment};