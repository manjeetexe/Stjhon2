const mongoose = require('mongoose');



const captainMessageSchema = new mongoose.Schema({
    senderId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captains',
        required: true,
    },
    receiverId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    }
},
{timestamps: true});

const captainMessage = mongoose.model("captainMessage",captainMessageSchema);

module.exports = captainMessage
