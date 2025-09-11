const postgres = require("postgres");

const sql = postgres({
  port: 5432,
  database: process.env.POSTGRES_DB || "messaging_service",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
});

module.exports = sql;
