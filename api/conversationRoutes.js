const express = require("express");
const router = express.Router();
const ApiResponse = require("./ApiResponse");
const { insertMessage } = require("../common");

// Get conversations
router.get("/api/conversations", async (req, res) => {
  try {
    const conversations = await getConversations();
    ApiResponse.ok(conversations, "webhook received successfully").send(res);
  } catch (err) {
    ApiResponse.error(`Server error:${err}`, 500).send(res);
  }
});

// Get messages for a conversation
router.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const conversationMessages = await getMessagesByConversationId(id);
    res
      .status(200)
      .json({ message: `Messages for conversation ${id}`, messages: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
