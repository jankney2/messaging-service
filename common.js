const sql = require("./db.js");
const postgres = require("postgres");

function isValidPhoneNumber(input) {
  if (!input) return { valid: false, normalized: "" };

  // Normalize: remove everything that is not a digit
  const normalized = input.replace(/\D/g, "");

  // Validate: allow optional country code (1–3 digits) + 10-digit number
  const regex = /^(\d{1,3})?\d{10}$/;
  const valid = regex.test(normalized);
  return { valid, normalized };
}

async function insertMessageToQueue({ message }) {
  try {
    await sql`
      insert into message_queue(
      message_id, 
      status, 
      created_at, 
      updated_at  
      )values (${message.message_id}, 'P', NOW(), NOW())
    `;
    return true;
  } catch (error) {
    throw new Error(
      `Failed to queue message ${message.message_id}: ${error.message}`
    );
  }
}

async function getMessagesByConversationId(id) {
  try {
    const messages = await sql`
      select * from message where conversation_id = ${id} order by timestamp desc
    `;
    return messages;
  } catch (error) {
    return error;
  }
}

async function insertMessage({
  from,
  to,
  type,
  body,
  attachments,
  timestamp,
  conversationId,
  messaging_provider_id,
}) {
  try {
    const [message] = await sql`
    
        insert into message(
    sent_by, 
    received_by, 
    type ,
    body,
    attachments , 
    timestamp ,
    conversation_id )
    values(
    ${from}, ${to}, ${type},${body}, ${attachments}, ${timestamp}, ${conversationId} 
    )
    returning *
  `;

    if (messaging_provider_id) {
      await sql`
      update message set messaging_provider_id = ${messaging_provider_id} where message_id = ${message.message_id}`;
    }

    let queued = await insertMessageToQueue({ message });
    if (queued) {
      return message;
    }
  } catch (error) {
    throw error;
  }

  return message;
}

async function getConversationByParticipants({ to, from }) {
  try {
    // Normalize phone numbers and sort to make order-insensitive
    const participants = [to.toString(), from.toString()];

    // Look up existing conversation
    const existing = await sql`
      SELECT *
      FROM conversation
      WHERE participants @> ${sql.array(participants, "text")}
        AND participants <@ ${sql.array(participants, "text")}
    `;

    if (existing.length > 0) {
      return existing[0];
    }

    // Insert new conversation with explicit type cast
    const [conversation] = await sql`
      INSERT INTO conversation (participants)
      VALUES (${sql.array(participants, "text")})
      RETURNING conversation_id, participants
    `;

    return conversation;
  } catch (err) {
    console.error("Error in getConversationByParticipants:", err);
    throw err;
  }
}

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return email.includes("@") && email.includes(".");
}

async function getConversations() {
  try {
    const conversations = await sql`
      select * from conversation limit 10
    `;
    return conversations;
  } catch (error) {
    return error;
  }
}

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  insertMessage,
  getConversationByParticipants,
  getMessagesByConversationId,
  getConversations,
};
