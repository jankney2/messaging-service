const ApiResponse = require("./api/ApiResponse");
const {
  isValidPhoneNumber,
  getConversationByParticipants,
  getConversations,
  insertMessage,
  isValidEmail,
} = require("./common");

const express = require("express");
const app = express();
const apiRoutes = require("./api/apiRoutes");

app.use(express.json());
app.use("/api", apiRoutes);

// db connection

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
