const {
  isValidPhoneNumber,
  checkForConversation,
  getConversationByParticipants,
} = require("./common");

const express = require("express");
const app = express();

// crud operations for api/messages

// message queue

const PORT = 8080;
const NODE_ENV = process.env.NODE_ENV || "DEV";
// logging for dev
if (NODE_ENV === "DEV") {
  app.use((req, res, next) => {
    console.log(`[DEV] ${req.method} ${req.originalUrl}`);
    next();
  });
}
app.use(express.json());

// db connection

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
    const db = req.app.get("db");
    const { from, to, type, body, attachments, timestamp } = req.body;
    // should always be sms
    if (type !== "sms") {
      throw new Error(
        'Incorrect message type supplied to endpoint. Type must be "sms"'
      );
    }

    if (isValidPhoneNumber(to)) {
      throw new Error(`"to" phone number is invalid. supplied number:${to}`);
    }
    if (isValidPhoneNumber(from)) {
      throw new Error(
        `"from" phone number is invalid. supplied number:${from}`
      );
    }

    const conversation = getConversationByParticipants({ to, from, db });

    const message = await db.query(`
        insert into message
    
    from 
    to 
    type 
    attachments , 
    timestamp 
    conversation_id 
    values(
    ${from}, ${to}, ${type},${body}, ${attachments}, ${timestamp}, ${conversation.conversation_id} 
    )
        `);

    res.status(400).json({ message: "SMS/MMS endpoint hit", data: req.body });
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
    const db = req.app.get("db");
    let query = Conversations.res
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
