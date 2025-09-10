const express = require("express");
const router = express.Router();
const ApiResponse = require("./ApiResponse");
const { insertMessage, isValidPhoneNumber } = require("../common");

router.post("/sms", async (req, res) => {
  try {
    const { from, to, type, body, attachments, timestamp } = req.body;
    if (type === "sms" || type === "mms") {
    } else {
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
router.post("/email", async (req, res) => {
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

module.exports = messageRouter;
