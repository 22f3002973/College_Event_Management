const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const axios = require("axios");

// REGISTER FOR EVENT
router.post("/register", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // CALL EVENT SERVICE TO REDUCE CAPACITY first
    const response = await axios.put(`http://localhost:5002/events/reduce/${eventId}`);

    if (response.data.message === "Full") {
      return res.json({ success: false, message: "Event is full" });
    }

    // prevent duplicate AFTER capacity check
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.json({ success: false, message: "Already registered" });
    }

    // create registration
    await Registration.create({ userId, eventId });

    // ✅ Update Event document to add user to registeredUsers
    await axios.put(`http://localhost:5002/events/addRegisteredUser/${eventId}`, {
      userId,
    });
    
    return res.json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

module.exports = router;



// GET MY REGISTRATIONS (WITH EVENT DETAILS)
router.get("/:userId", async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.params.userId,
    });

    // fetch event details for each registration
    const result = await Promise.all(
      registrations.map(async (reg) => {
        const event = await axios.get(
          `http://localhost:5002/events/${reg.eventId}`
        );

        return {
          _id: reg._id,
          userId: reg.userId,
          event: event.data,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;