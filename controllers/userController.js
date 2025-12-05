const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) return res.status(401).json({success: false, message: `Name, email and password are required`});

        const duplicateUser = await User.findOne({email}).exec();
        if(duplicateUser) return res.status(409).json({success: false, message: `email existed`});

        const result = await User.create({name, email, password});
        console.log(result);
        return res.status(200).json({success: true, message: `Username ${name} created`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

const authController = async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(401).json({success: false, message: `Email and password are required`});

        const foundUser = await User.findOne({email}).select('+password').exec();
        if(!foundUser) return res.status(401).json({success: false, message: `User ${email} do not existed`});

        const isMatch = await foundUser.comparePassword(password);
        if(!isMatch) return res.status(401).json({success: false, message: `Wrong password`});
        const accessToken = jwt.sign(
            {
                userInfor: 
                    {
                        email: foundUser.email,
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
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({success: false, message: 'Error'});

        const accessToken = '';
        return res.status(200).json({accessToken});
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: 'Server internal error'});
    }
}

module.exports = {registerController, authController, logoutController};