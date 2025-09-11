const sql = require("./db");
const twilio = require("twilio");

// this will not work until env variables are setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MessageService {
  constructor() {
    this.sql = require("./db");
    this.twilioClient = twilioClient;
    this.sgMail = sgMail;
  }

  async processMessages(messages) {
    // pull messages from message queue.
    // depending on type, send to the appropriate provider
    // update message status in queue

    queue.forEach(async (message) => {
      try {
        let promises = [];
        let queue = await sql`select * from message m
        join message_queue mq on m.message_id=mq.message_id
        where messaging_provider_id is null order by mq.created_at asc limit 100`;
        if (message.type === "sms" || message.type === "mms") {
          promises.push(this.processSmsOrMms(message));
        } else if (message.type === "email") {
          promises.push(this.processEmail(message));
        }

        await Promise.all(promises);
      } catch (error) {
        throw error;
      }
    });
  }

  async updateMessageQueueStatus(messageId, status) {
    try {
      await sql`update message_queue set status=${status} where message_id=${messageId}`;
    } catch (error) {
      throw error;
    }
  }

  async processSmsOrMms(message) {
    try {
      const twilioMessage = await this.twilioClient.messages.create({
        body: message.body,
        from: message.from,
        to: message.to,
        mediaUrl: message.attachments,
      });
      await this.updateMessageQueueStatus(message.message_id, "D");
    } catch (error) {
      await this.updateMessageQueueStatus(message.message_id, "E");
      throw error;
    }
  }

  async processEmail(message) {
    try {
      const body = {
        to: message.to,
        from: message.from,
        // we don't support these through our api?
        subject: "Message Sent From Hatch API",
        html: message.body,
      };

      await this.sgMail.send(body);
      await this.updateMessageQueueStatus(message.message_id, "D");
    } catch (error) {
      await this.updateMessageQueueStatus(message.message_id, "E");
      throw error;
    }
  }

  async cleanMessageQueue() {
    try {
      await sql`delete from message_queue where status='D' and message_id in (select message_id from message_queue order by created_at asc limit 100)`;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MessageService;
