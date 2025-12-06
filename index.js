const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = 3500;
const app = express();

//Router
const userRouter = require('./route/user');
const postRouter = require('./route/post');
const commentRouter = require('./route/comment');

//Special and important middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware verify
const verifyToken = require('./middleware/verifyToken');

//Database connected
const databaseConnected = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log('mongoose is connected');
    } catch(e) {
        console.log(e);
    }
}
databaseConnected();

//User Router
app.use('/api/users', userRouter);
//Verify middleware
app.use(verifyToken);
//Post Router
app.use('/api/posts', postRouter);
//Comment Router
app.use('/api/posts', commentRouter);


//Start app
app.listen(PORT, ()=> {
    console.log(`Sever is running on port ${PORT}`)
});