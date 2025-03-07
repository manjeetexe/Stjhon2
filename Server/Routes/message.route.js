const express = require('express');
const router = express.Router();
const authMiddleware = require('./../Middlewares/auth.middleware')
const messageController = require('./../Controllers/message.controller')



router.get('/usermsg' ,messageController.getcaptainsforSidebar)

router.get('/:captainChatid',authMiddleware.authUser ,messageController.getcaptainsMessages)

router.post('/send/:captainChatid',authMiddleware.authUser ,messageController.sendCaptainMsg)




module.exports = router