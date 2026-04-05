const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Feedback = require("../models/Feedback");
const axios = require("axios");
const mongoose = require("mongoose");

// REGISTER FOR EVENT
router.post("/register", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // STEP 1: Check duplicate
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.json({ success: false, message: "Already registered" });
    }

    // STEP 2: Reduce capacity
    const response = await axios.put(
      `http://localhost:5002/events/reduce/${eventId}`
    );

    if (response.data.message === "Full") {
      return res.json({ success: false, message: "Event is full" });
    }

    try {
      // STEP 3: Create registration
     
      await Registration.create({ userId, eventId });

      // STEP 4: Add user to event
      await axios.put(
        `http://localhost:5002/events/addRegisteredUser/${eventId}`,
        { userId }
      );

      return res.json({ success: true, message: "Registered successfully" });

    } catch (innerErr) {
      // 🔥 ROLLBACK: Restore capacity
      await axios.put(
        `http://localhost:5002/events/increase/${eventId}`
      );

      console.error("Rollback triggered:", innerErr);

      return res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error. Try again later.",
    });
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

// POST /register/feedback → Submit feedback
router.post("/feedback", async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    // Validate required fields
    if (!userId || !eventId || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Optional: Prevent duplicate feedback for same event by same user
    const existing = await Feedback.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Feedback already submitted for this event" });
    }

    // Create and save feedback
    const feedback = new Feedback({ userId, eventId, rating, comment });
    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

// GET /register/feedback/:userId → Fetch all feedback by a student
router.get("/feedback/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch feedbacks for this student, newest first
    const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 });

    // Populate event details safely
    const detailedFeedbacks = await Promise.all(
      feedbacks.map(async (fb) => {
        try {
          // Fetch event from event service
          const event = await axios.get(`http://localhost:5002/events/${fb.eventId}`);

          return {
            _id: fb._id,
            userId: fb.userId,
            event: event.data
              ? {
                  _id: fb.eventId,
                  title: event.data.title,
                  date: event.data.date,
                }
              : { _id: fb.eventId, title: "Event not found", date: null },
            rating: fb.rating,
            comment: fb.comment,
            createdAt: fb.createdAt,
          };
        } catch (err) {
          console.error("Axios error fetching event:", err.response?.data || err.message);
          return {
            _id: fb._id,
            userId: fb.userId,
            event: { _id: fb.eventId, title: "Event not found", date: null },
            rating: fb.rating,
            comment: fb.comment,
            createdAt: fb.createdAt,
          };
        }
      })
    );

    res.status(200).json(detailedFeedbacks);
  } catch (err) {
    console.error("Server error in GET feedback/:userId:", err.message);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

module.exports = router;