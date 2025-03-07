const express = require('express');
const router = express.Router();
const authMiddleware = require('./../Middlewares/auth.middleware')
const messageCaptainController = require('./../Controllers/captainmessage.controller')



router.get('/sidebar/captainmsg' ,messageCaptainController.getuserforSidebar)

router.get('captain/:userChatId',authMiddleware.authCaptain ,messageCaptainController.getuserMessages)

router.post('/send/:userChatId',authMiddleware.authCaptain ,messageCaptainController.senduserMsg)




module.exports = router