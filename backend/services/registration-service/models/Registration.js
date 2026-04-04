const mongoose = require("mongoose");

const regSchema = new mongoose.Schema({
  userId: String,
  eventId: String
});

module.exports = mongoose.model("Registration", regSchema);