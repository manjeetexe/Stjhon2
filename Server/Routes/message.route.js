const express = require('express');
const router = express.Router();
const authMiddleware = require('./../Middlewares/auth.middleware')
const messageController = require('./../Controllers/message.controller')



router.get('/usermsg',authMiddleware.authUser ,messageController.getcaptainsforSidebar)


router.get('/:captainChatid',authMiddleware.authUser ,messageController.getcaptainsMessages)

router.get('/send/:captainChatid',authMiddleware.authUser ,messageController.sendCaptainMsg)




export default router;