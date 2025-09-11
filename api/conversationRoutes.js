const express = require("express");
const router = express.Router();
const ApiResponse = require("./ApiResponse");
const {
  getConversations,
  getMessagesByConversationId,
} = require("../app/common");

// Get conversations
router.get("/", async (req, res) => {
  try {
    const conversations = await getConversations();
    ApiResponse.ok(conversations, "Conversations retrieved successfully").send(
      res
    );
  } catch (err) {
    ApiResponse.error(`Server error:${err}`, 500).send(res);
  }
});

// Get messages for a conversation
router.get("/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const conversationMessages = await getMessagesByConversationId(id);
    ApiResponse.ok(
      conversationMessages,
      "Conversation Messages retrieved successfully"
    ).send(res);
  } catch (err) {
    console.error(err);
    ApiResponse.error(`Server error:${err}`, 500).send(res);
  }
});

module.exports = router;
