const userModel = require('./../Models/userModel')
const mongoose = require('mongoose');
const captainMessageModel = require('./../Models/captainmessageModel')

module.exports.getuserforSidebar = async function (req, res, next) {

    try {
        
        
        const filterUsers = await userModel.find()
        res.status(200).json(filterUsers)


    } catch (err) {

        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'An unexpected error occurred, please try again later' });
    }
    
};


module.exports.getuserMessages = async function (req, res, next) {
    try {
        const { userChatId } = req.params;
        const captainID = req.query.advocateId;
        
        console.log("User Chat ID:", userChatId);
        console.log("Captain ID from authMiddleware:", captainID);

        if (!captainID) {
            return res.status(401).json({ error: "Captain authentication failed. Please login again." });
        }

        const userChatObjectId = new mongoose.Types.ObjectId(userChatId);

        const messages = await captainMessageModel.find({
            $or: [
                { senderId: captainID, receiverId: userChatObjectId },
                { senderId: userChatObjectId, receiverId: captainID }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: err.message });
    }
};






module.exports.senduserMsg = async function (req, res) {
    try {
        const { text } = req.body;
        const { userChatId } = req.params;  
        const captainID = req.captain._id;   

        console.log(text)
        console.log(userChatId)
        console.log(captainID)

        

        if (!text.trim()) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        const newMessage = new captainMessageModel({
            senderId: captainID,
            receiverId: userChatId ,
            text,
        });

        await newMessage.save();

        // ✅ Socket.io can be added here for real-time messaging

        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: "Internal Server error" });
    }
};