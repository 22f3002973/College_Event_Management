const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  studentId: String,
  eventId: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);