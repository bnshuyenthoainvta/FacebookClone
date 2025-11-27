const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('./route/user');
const postRouter = require('./route/post');
const commentRouter = require('./route/comment');
const verifyToken = require('./middleware/verifyToken');

const PORT = 3500;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connected
const databaseConnected = () => {
    try {
        mongoose.connect(`mongodb+srv://anhht191257:Hoangtuananh95@cluster0.tkfs99z.mongodb.net/`);
        console.log('mongoose is connected');
    } catch(e) {
        console.log(e);
    }
}
databaseConnected();

//User Router
app.use('/user', userRouter);
//Verify middleware
app.use(verifyToken);
//Post Router
app.use('/post', postRouter);
//Comment Router
app.use('/comment', commentRouter);


app.listen(PORT, ()=> {
    console.log(`Sever is running on port ${PORT}`)
})