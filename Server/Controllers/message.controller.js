const captainModel = require('./../Models/captainModel')
const userModel = require('./../Models/userModel')
const messageModel = require('./../Models/messageModel')

module.exports.getcaptainsforSidebar = async function (req, res, next) {

    try {
        

        const filterCaptains = await captainModel.find().select('password')
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

        
        const messages = await messageModel.find({
            $or: [
                { sender: userID, receiver: captainChatid },
                { sender: captainChatid, receiver: userID }
            ]
        }).sort({ createdAt: 1 }); 

        res.status(200).json(messages);

    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'An unexpected error occurred, please try again later' });
    }
};




module.exports.sendCaptainMsg = async function (req, res, next) {
    try {
        
        const { captainChatid } = req.params;
        const userID = req.user._id;

        
        
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'An unexpected error occurred, please try again later' });
    }
};