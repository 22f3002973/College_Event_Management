const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  venue: String,
  capacity: Number,
  fee: Number,
  date: String,
  time: String,
  type: String,
  prizes: String,
  organizerId: String,
  status: { type: String, default: "pending" },
   registeredUsers: [String], // array of userIds
});

module.exports = mongoose.model("Event", eventSchema);