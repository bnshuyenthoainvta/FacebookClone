const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    likes: [{
        type: schema.Types.ObjectId,
        ref: 'Users'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    comments: [{
        type: schema.Types.ObjectId,
        ref: 'Comments'
    }]
});

module.exports = mongoose.model('Posts', postSchema);