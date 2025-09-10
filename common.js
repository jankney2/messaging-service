import sql from "./db.js";
import postgres from "postgres";
function isValidPhoneNumber(input) {
  const cleaned = input.replace(/[\s-]/g, "");
  // match +<country><10 digits> OR <10 digits with optional country code>
  const regex = /^(\+\d{1,3})?\d{10}$/;
  return regex.test(cleaned);
}

export async function getConversationByParticipants({ to, from }) {
  try {
    // look up existing conversation with exactly these two participants
    const existing = await sql`
      SELECT *
      FROM conversation
      WHERE participants @> ${postgres.array([to, from])}
        AND participants <@ ${postgres.array([to, from])}
    `;

    if (existing.length > 0) {
      return existing[0];
    }

    // if none found, insert a new conversation
    const [conversation] = await sql`
      INSERT INTO conversation (participants)
      VALUES (${postgres.array([to, from])})
      RETURNING conversation_id, participants
    `;

    return conversation;
  } catch (err) {
    console.error("Error in getConversationByParticipants:", err);
    throw err;
  }
}

module.exports = {
  isValidPhoneNumber,
  getConversationByParticipants,
};
