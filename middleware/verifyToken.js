const jwt = require('jsonwebtoken');

const verifyAccessToken = (req,res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({success: false, message: 'Authorization header required'});

        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(
            token,
            process.env.ACCESS_SECRET_TOKEN
        );
        if(!decode) return res.status(401).json({success: false, message: 'Decoded error'});
        req.user =  decode.userInfor;
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({success: false, message: `Server internal error`});
    }
}

module.exports = verifyAccessToken;
