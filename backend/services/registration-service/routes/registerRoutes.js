const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const axios = require("axios");

// ✅ IMPORT PRODUCER
const sendMessage = require("../rabbitmq/producer");

// REGISTER FOR EVENT
router.post("/", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Prevent duplicate
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.json({ message: "Already registered" });
    }

    // Optional: Check event exists
    const eventRes = await axios.get(`http://localhost:5002/events/${eventId}`);
    const event = eventRes.data;

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ SAVE REGISTRATION FIRST
    const reg = await Registration.create({ userId, eventId });

    // ✅ SEND MESSAGE TO RABBITMQ (ASYNC)
    await sendMessage("event_queue", {
      eventId,
      userId
    });

    res.json({
      success: true,
      message: "Registered (processing async)",
      reg
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN VIEW
router.get("/", async (req, res) => {
  const data = await Registration.find();
  res.json(data);
});

module.exports = router;