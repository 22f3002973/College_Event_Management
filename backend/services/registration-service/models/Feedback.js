// models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },     // student giving feedback
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // <- ObjectId
  rating: { type: Number, required: true, min: 1, max: 5 }, // 1 to 5
  comment: { type: String, maxlength: 500 },    // optional comment
  createdAt: { type: Date, default: Date.now }  // timestamp
});

module.exports = mongoose.model("Feedback", feedbackSchema);