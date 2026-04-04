const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 UNIQUE COMBINATION (student + event)
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);