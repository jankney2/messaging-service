const express = require("express");
const router = express.Router();
const webhookRoutes = require("./webhookRoutes");
const messageRoutes = require("./messageRoutes");
const conversationRoutes = require("./conversationRoutes");

router.use("/webhooks", webhookRoutes);
router.use("/messages", messageRoutes);
router.use("/conversations", conversationRoutes);

module.exports = router;
