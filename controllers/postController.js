const Post = require('../models/Post');

const createPost = async (req, res) => {
    try {
        const author = req.user.userId;
        const content = req.body.content;

        if(!author) return res.status(401).json({success: false, message: 'You must be logged in to create a post'});
        if(!content) return res.status(400).json({success: false, message: 'Content is required'});

        const result = await Post.create({author, content});
        return res.status(201).json({success: true, message: 'Post created successfully', result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const sharePost = async (req, res) => {
    try {
        const author = req.user.userId;
        const content = req.body.content;
        const originalPostId = req.params.id;

        if(!originalPostId) return res.status(400).json({success: false, message: 'Original post ID is required'});
        if(!content) return res.status(400).json({success: false, message: 'Share content is required'});
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in to share a post'});

        //Find original post
        const originalPost = await Post.findById(originalPostId);
        if(!originalPost) return res.status(404).json({success: false, message: 'Original post not found'});

        //Increment shareCount of original post
        await Post.findByIdAndUpdate(
            originalPostId,
            {$inc: {shareCount: 1}}
        );

        //Share post
        const result = await Post.create({author, content, originalPost: originalPostId});
        return res.status(201).json({success: true, message: 'Share post successfully', result});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const deletePost = async (req, res) => {
    try {
        const author = req.user.userId;
        const postId = req.params.id;

        if(!postId) return res.status(400).json({success: false, message: 'Post ID is required'});
        if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ success: false, message: 'Invalid Post ID' });
        if(!author) return res.status(401).json({success: false, message: 'You must be logged in to delete a post'});

        const foundPost = await Post.findById(postId);
        if(!foundPost) return res.status(404).json({success: false, message: 'Post not found'});

        //Check Owner
        if(foundPost.author.toString() !== author) return res.status(403).json({success: false, message: 'You cannot delete this post'});

        //If foundPost is a share post, we have to find original post and decrement shareCount from originalPost
        if(foundPost.originalPost) {
            await Post.findByIdAndUpdate(
                foundPost.originalPost, 
                {$inc: {shareCount: -1}}
            );
        }

        //Recursively delete all shares of this post (children), then delete this post
        async function deleteAllSharePost (postIdToDelete) {
            const children = await Post.find({originalPost: postIdToDelete}).select('_id');

            const ids = children.map(child => child._id);

            for(const child of children) {
                await deleteAllSharePost(child._id);
            }

            await Post.deleteMany({_id: {$in: ids}});
        }

        // Start recursive deletion from the found post's _id
        await deleteAllSharePost(foundPost._id);

        // Finally delete the found post
        await Post.findByIdAndDelete(foundPost._id);

        return res.status(202).json({success: true, message: 'Delete post successfully'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}
 
module.exports = {createPost, sharePost, deletePost};