const mongoose = require("mongoose");

const regSchema = new mongoose.Schema({
  userId: String,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }
});

module.exports = mongoose.model("Registration", regSchema);