const captainModel = require('../Models/captainModel')
const userModel = require('../Models/userModel')
const mongoose = require('mongoose');
const messageModel = require('../Models/messageModel')

module.exports.getcaptainsforSidebar = async function (req, res, next) {

    try {
        

        const filterCaptains = await captainModel.find()
        res.status(200).json(filterCaptains)


    } catch (err) {

        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'An unexpected error occurred, please try again later' });
    }
    
};

module.exports.getcaptainsMessages = async function (req, res, next) {
    try {
        const { captainChatid } = req.params;  
        const userID = req.user._id;           

        

        // Convert captainChatid to ObjectId
        const captainChatObjectId = new mongoose.Types.ObjectId(captainChatid);

        // Query with ObjectId comparison
        const messages = await messageModel.find({
            $or: [
                { senderId: userID, receiverId: captainChatObjectId },
                { senderId: captainChatObjectId, receiverId: userID }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "An unexpected error occurred, please try again later" });
    }
};

module.exports.sendCaptainMsg = async function (req, res) {
    try {
        const { text } = req.body;
        const { captainChatid } = req.params;
        const userID = req.user._id;

        

        if (!text.trim()) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        const newMessage = new messageModel({
            senderId: userID,
            receiverId: captainChatid,
            text,
        });

        await newMessage.save();

        // ✅ Socket.io can be added here for real-time messaging

        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: "Internal Server error" });
    }
}
