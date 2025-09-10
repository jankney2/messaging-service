const ApiResponse = require("./api/ApiResponse");
const {
  isValidPhoneNumber,
  getConversationByParticipants,
  insertMessage,
  isValidEmail,
} = require("./common");

const express = require("express");
const app = express();

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
    const { from, to, type, body, attachments, timestamp } = req.body;
    if (type !== "sms" || type !== "mms") {
      ApiResponse.error(
        'Incorrect message type supplied to endpoint. Type must be "sms" or "mms"',
        400
      ).send(res);
    }
    let toPhone = isValidPhoneNumber(to);
    let fromPhone = isValidPhoneNumber(from);

    if (!toPhone.valid) {
      ApiResponse.error(
        `"to" phone number is invalid. supplied number:${to}`,
        400
      ).send(res);
    }
    if (!fromPhone.valid) {
      ApiResponse.error(
        `"from" phone number is invalid. supplied number:${from}`,
        400
      ).send(res);
    }

    // const conversation = await getConversationByParticipants({
    //   to: toPhone.normalized,
    //   from: fromPhone.normalized,
    // });

    const message = await insertMessage({
      from: fromPhone.normalized,
      to: toPhone.normalized,
      type,
      body,
      attachments,
      timestamp,
      conversationId: 1,
    });

    ApiResponse.created(message, "Message created successfully").send(res);
  } catch (err) {
    ApiResponse.error(`Server error:${err}`, 500).send(res);
  }
});

// Send Email
app.post("/api/messages/email", async (req, res) => {
  try {
    const { from, to, type, body, attachments, timestamp } = req.body;

    if (!isValidEmail(to)) {
      ApiResponse.error(
        `"to" email is invalid. supplied email:${to}`,
        400
      ).send(res);
    }
    if (!isValidEmail(from)) {
      ApiResponse.error(
        `"from" email is invalid. supplied email:${from}`,
        400
      ).send(res);
    }

    // const conversation = await getConversationByParticipants({
    //   to: toPhone.normalized,
    //   from: fromPhone.normalized,
    // });

    const message = await insertMessage({
      from,
      to,
      type: "email",
      body,
      attachments,
      timestamp,
      conversationId: 1,
    });

    ApiResponse.created(message, "email created successfully").send(res);
  } catch (err) {
    console.error(err);
    ApiResponse.error(`Server error:${err}`, 500).send(res);
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

module.exports = app;
