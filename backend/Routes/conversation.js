const express = require('express');
const router = express.Router();
const auth = require('../Authentication/Auth');
const conversationController = require("../Controllers/conversation");

router.post("/add-conversation",auth,conversationController.addConversation)
router.get("/get-conversation",auth,conversationController.getConversation)
module.exports = router;