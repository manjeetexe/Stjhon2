const captainModel = require('./../Models/captainModel')
const captainService = require('./../Services/captain.service')
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('./../Models/blackListToken')
const jwt = require("jsonwebtoken");

module.exports.regesterCaptain = async function (req, res, next) {
    try {
        // Validate incoming request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, } = req.body;

        

        // Check if the captain already exists
        const isCaptainAlreadyExist = await captainModel.findOne({ email: email });
        if (isCaptainAlreadyExist) {
            return res.status(400).json({ error: 'Captain with this email already exists' });
        }

        // Hash password before saving to the database
        const hashPassword = await captainModel.hashPassword(password);

        // Create captain using the service
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashPassword,
            
        });

        // Generate JWT token for the captain
        const token = captain.generateAuthToken();

        // Send token as a cookie in the response
        res.cookie('token', token);

        // Send response with token and captain details
        return res.status(201).json({ token, captain });
    } catch (error) {
        // Log the error for debugging
        console.error('Registration error:', error);

        // Handle different types of errors
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate entry found' });
        }

        // Handle other errors
        return res.status(500).json({ error: 'An unexpected error occurred, please try again later' });
    }
};




module.exports.loginCaptain = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("Received request body:", req.body); // Debugging

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in HTTP-only cookie (Optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    console.log("Login successful for:", email);

    return res.status(200).json({ token, captain });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred, please try again later" });
  }
};



module.exports.getCaptainProfile = async function (req, res, next) {

    res.status(200).json(req.captain)
}

module.exports.logoutCaptain = async function (req, res, next){
    res.clearCookie('token')

    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blacklistTokenModel.create({ token })

    res.status(200).json({ message: 'Logged out' });
}