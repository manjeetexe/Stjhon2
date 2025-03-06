const express = require('express');
const router = express.Router();
const authMiddleware = require('./../Middlewares/auth.middleware')
const messageCaptainController = require('./../Controllers/captainmessage.controller')



router.get('/captainmsg',authMiddleware.authCaptain ,messageCaptainController.getuserforSidebar)

router.get('/:userChatId ',authMiddleware.authCaptain ,messageCaptainController.getuserMessages)

router.post('/send/:userChatId ',authMiddleware.authCaptain ,messageCaptainController.senduserMsg)




module.exports = router