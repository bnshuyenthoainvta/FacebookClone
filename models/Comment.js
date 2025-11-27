const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    postId: [{
        type: schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    }],
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date
    },
});

module.exports = mongoose.model('Comments', commentSchema);