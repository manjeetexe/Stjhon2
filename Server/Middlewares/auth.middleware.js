const userModel = require('./../Models/userModel');
const jwt = require('jsonwebtoken'); 
const blackListTokenModel = require('./../Models/blackListToken');
const captainModel = require('../Models/captainModel');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    
    

    if(!token) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    const blackListed = await blackListTokenModel.findOne({ token: token });

    if(blackListed) {
        return res.status(401).json({ error: ' Unanthorized' });
    }

    try {
        // Decode and verify the JWT using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use jwt.verify to verify the token
  
    
        // Find the user by ID from the decoded token
        const user = await userModel.findById(decoded._id);
    
        req.user = user;
    
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Not authorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];  // Extract token from header
        if (!token) {
            return res.status(401).json({ error: "No token provided. Unauthorized access." });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
        req.captain = await captainModel.findById(decoded.id);  // Get captain from DB

        if (!req.captain) {
            return res.status(401).json({ error: "Captain not found. Invalid token." });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};