// db.js
import postgres from "postgres";

const sql = postgres({
  port: 5432,
  database: `messaging_service`,
  username: `messaging_user`,
  password: `messaging_password`,
  port: `5432`,
  host: "localhost",
});

export default sql;
