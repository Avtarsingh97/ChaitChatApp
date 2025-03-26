const express = require('express');
const router = express.Router();
const auth = require('../Authentication/Auth');
const messageController = require("../Controllers/message")

router.post("/post-message-chat",auth,messageController.sendMessage)
router.get("/get-message-chat/:convId",auth,messageController.getMessage)


module.exports = router;