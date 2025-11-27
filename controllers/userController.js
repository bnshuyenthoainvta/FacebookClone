const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const registerController = async (req,res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) return res.status(401).json({success: false, message: `username and password are required`});

        const duplicateUser = await User.findOne({username}).exec();
        if(duplicateUser) return res.status(409).json({success: false, message: `username existed`});

        const hashPassword = await argon2.hash(password);
        const result = await User.create({
            username,
            password: hashPassword
        });
        console.log(result);
        return res.status(200).json({success: true, message: `User ${username} created`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const authController = async(req,res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) return res.status(401).json({success: false, message: `username and password are required`});

        const foundUser = await User.findOne({username}).exec();
        if(!foundUser) return res.status(401).json({success: false, message: `username ${username} do not existed`});

        const verifyUser = await argon2.verify(foundUser.password, password);
        if(!verifyUser) return res.status(401).json({success: false, message: `username and password are wrong`});
        const accessToken = jwt.sign(
            {
                userInfor: 
                    {
                        username: foundUser.username,
                        userID: foundUser.id
                    }
            },
            process.env.ACCESS_SECRET_TOKEN,
            {expiresIn: '1d'}
        );
        return res.status(200).json({accessToken, userId: foundUser.id});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const logoutController = async (req,res) => {
    try {
        const authHeader = req.headers.Authorization || req.headers.authorization;
        if(!authHeader) return res.status(401).json({success: false, message: 'Error'});

        const accessToken = '';
        return res.status(200).json({accessToken});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = {registerController, authController, logoutController};