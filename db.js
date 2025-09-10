// db.js
const postgres = require("postgres");

const sql = postgres({
  port: 5432,
  database: `messaging_service`,
  username: `postgres`,
  password: `postgres`,
  port: `5432`,
  host: "localhost",
});

module.exports = sql;
