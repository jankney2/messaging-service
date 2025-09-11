const postgres = require("postgres");
require("dotenv").config();
const { POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

const sql = postgres({
  port: 5432,
  database: `messaging_service`,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  // username: `postgres`,
  // password: `postgres`,
  port: `5432`,
  host: "localhost",
});

module.exports = sql;
