const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const axios = require("axios");

// REGISTER FOR EVENT
router.post("/", async (req, res) => {
  await axios.put(
  `http://localhost:5002/events/addRegisteredUser/${eventId}`,
  { userId }
);
  const { userId, eventId } = req.body;

  // Prevent duplicate
  const existing = await Registration.findOne({ userId, eventId });
  if (existing) return res.json({ message: "Already registered" });

  // Get event
  const eventRes = await axios.get(`http://localhost:5002/events/${eventId}`);
  const event = eventRes.data;

  if (event.capacity <= 0) {
    return res.json({ message: "Event Full" });
  }

  // Reduce capacity
  const reduceRes = await axios.put(
    `http://localhost:5002/events/reduce/${eventId}`
  );

  if (reduceRes.data.message === "Full") {
    return res.json({ message: "Event just got full" });
  }

  // Save
  const reg = await Registration.create({ userId, eventId });

  res.json({ success: true, message: "Registered", reg });
});

// ADMIN VIEW
router.get("/", async (req, res) => {
  const data = await Registration.find();
  res.json(data);
});

module.exports = router;