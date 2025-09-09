const express = require("express");
const app = express();

const PORT = 8080;
const NODE_ENV = process.env.NODE_ENV || "DEV";
if (NODE_ENV === "DEV") {
  app.use((req, res, next) => {
    console.log(`[DEV] ${req.method} ${req.originalUrl}`);
    next();
  });
}
app.use(express.json());

// Ping
app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Messaging service is running" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send SMS/MMS
app.post("/api/messages/sms", async (req, res) => {
  try {
    // TODO: Implement SMS/MMS send logic
    res.status(201).json({ message: "SMS/MMS endpoint hit", data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send Email
app.post("/api/messages/email", async (req, res) => {
  try {
    // TODO: Implement Email send logic
    res.status(201).json({ message: "Email endpoint hit", data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Incoming SMS/MMS webhook
app.post("/api/webhooks/sms", async (req, res) => {
  try {
    // TODO: Handle inbound SMS/MMS webhook
    res
      .status(200)
      .json({ message: "SMS/MMS webhook received", data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Incoming Email webhook
app.post("/api/webhooks/email", async (req, res) => {
  try {
    // TODO: Handle inbound Email webhook
    res.status(200).json({ message: "Email webhook received", data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get conversations
app.get("/api/conversations", async (req, res) => {
  try {
    // TODO: Fetch list of conversations
    res
      .status(200)
      .json({ message: "Conversations endpoint hit", conversations: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages for a conversation
app.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Fetch messages for conversation with ID
    res
      .status(200)
      .json({ message: `Messages for conversation ${id}`, messages: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
  });
}
module.exports = app;
