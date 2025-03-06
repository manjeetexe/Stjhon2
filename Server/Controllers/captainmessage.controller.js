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
        const captainID = req.captain._id;           

        

        // Convert captainChatid to ObjectId
        const userChatObjectId = new mongoose.Types.ObjectId(userChatId);

        // Query with ObjectId comparison
        const messages = await captainMessageModel.find({
            $or: [
                { senderId: captainID, receiverId: userChatId },
                { senderId: userChatId, receiverId: captainID }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "An unexpected error occurred, please try again later" });
    }
};






module.exports.senduserMsg = async function (req, res) {
    try {
        const { text } = req.body;
        const { userChatId } = req.params;  
        const captainID = req.captain._id;   

        

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