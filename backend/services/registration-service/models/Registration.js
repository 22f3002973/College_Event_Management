const mongoose = require("mongoose");

const regSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", regSchema);