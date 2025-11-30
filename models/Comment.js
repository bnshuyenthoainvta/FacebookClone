const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new schema({
    _id: {
        type: schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    post: [
        {
            type: schema.Types.ObjectId,
            ref: 'Posts',
            required: true
        }
    ],
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date
    },
});

module.exports = mongoose.model('Comments', commentSchema);