const ApiResponse = require("../api/ApiResponse");
const session = require("express-session");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { SESSION_SECRET } = process.env;
const app = express();
const apiRoutes = require("../api/apiRoutes");
const cors = require("cors");

app.use(express.json());
// update as the app grows
app.use(cors({ origin: "*" }));
app.use("/api", apiRoutes);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //one day
    },
  })
);

// Ping
app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Messaging service is running" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
