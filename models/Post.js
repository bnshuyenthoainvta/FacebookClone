const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    likes: [{
        type: schema.Types.ObjectId,
        ref: 'Users'
    }],
    shares: [
        {
            _id: 
            {
                type: schema.Types.ObjectId,
                required: true
            },
            user: 
            {
                type: schema.Types.ObjectId,
                ref: 'Users',
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    comments: [
        {
            type: schema.Types.ObjectId,
            ref: 'Comments'
        }
    ],
});

module.exports = mongoose.model('Posts', postSchema);