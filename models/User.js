const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date
    },
    posts: [
        {
            type: schema.Types.ObjectId,
            ref: 'Posts'
        }
    ],
    shares: [
        {
            _id: 
            {
                type: schema.Types.ObjectId,
                required: true
            },
            post: 
            {
                type: schema.Types.ObjectId,
                ref: 'Posts',
                required: true
            },
            createAt: 
            {
                type: Date,
                default: Date.now
            },
            updateAt: 
            {
                type: Date
            }
        }
    ],
    comments: [
        {
            type: schema.Types.ObjectId,
            ref: 'Comments'
        }
    ]
});

module.exports = mongoose.model('Users', userSchema);