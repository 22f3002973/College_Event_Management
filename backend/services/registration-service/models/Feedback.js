const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // ✅ changed
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);