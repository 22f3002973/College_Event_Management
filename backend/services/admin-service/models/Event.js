const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  venue: String,

  status: {
    type: String,
    default: "pending",
  },

  organizerId: String,

  // 🔥 NEW FIELDS
  capacity: {
    type: Number,
    default: 100,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);