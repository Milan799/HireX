const express = require("express");
const router = express.Router();
const { getChatHistory, getConversations } = require("../controllers/chat.controller");
const { verifyJWT } = require("../middlewares");

router.get("/conversations", verifyJWT, getConversations);
router.get("/:userId", verifyJWT, getChatHistory);

module.exports = router;
