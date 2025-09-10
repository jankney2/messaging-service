const express = require("express");
const router = express.Router();
const ApiResponse = require("./ApiResponse");
const { insertMessage } = require("../common");

// Incoming SMS/MMS webhook
router.post("/sms", async (req, res) => {
  try {
    const {
      from,
      to,
      type,
      body,
      attachments,
      timestamp,
      messaging_provider_id,
    } = req.body;
    const message = await insertMessage({
      from,
      to,
      type,
      body,
      attachments,
      timestamp,
      conversationId: 1,
      messaging_provider_id,
    });

    ApiResponse.created(message, "message created successfully").send(res);
  } catch (err) {
    ApiResponse.error(`Server error:${err}`, 500).send(res);
  }
});

// Incoming Email webhook
router.post("/email", async (req, res) => {
  try {
    const { from, to, type, body, attachments, timestamp, xillio_id } =
      req.body;

    const message = await insertMessage({
      from,
      to,
      type: "email",
      body,
      attachments,
      timestamp,
      conversationId: 1,
      messaging_provider_id: xillio_id,
    });

    ApiResponse.created(message, "webhook received successfully").send(res);
  } catch (err) {
    console.error(err);
    ApiResponse.error(`Server error:${err}`, 500).send(res);
  }
});

module.exports = router;
