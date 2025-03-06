const express = require('express');
const router = express.Router();
const authMiddleware = require('./../Middlewares/auth.middleware')
const messageCaptainController = require('./../Controllers/captainmessage.controller')



router.get('/captainmsg',authMiddleware.authUser ,messageCaptainController.getuserforSidebar)

router.get('/:userChatid',authMiddleware.authUser ,messageCaptainController.getuserMessages)

router.post('/send/:userChatid',authMiddleware.authUser ,messageCaptainController.senduserMsg)




module.exports = router