const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Feedback = require("../models/Feedback");
const axios = require("axios");
const sendMessage = require("../rabbitmq/producer");

// ================= REGISTER =================
router.post("/", async (req, res) => {
  let reg;
  try {
    const { userId, eventId } = req.body;

    
    if (!userId || !eventId) {
      return res.status(400).json({ message: "userId and eventId required" });
    }

    // STEP 1: Check duplicate
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.json({ success: false, message: "Already registered" });
    }

    // STEP 0: Check if event exists
    try {
      await axios.get(`http://localhost:5002/events/${eventId}`);
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
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
     
      reg = await Registration.create({ userId, eventId });

      // STEP 4: Add user to event
      await axios.put(
        `http://localhost:5002/events/addRegisteredUser/${eventId}`,
        { userId }
      );
      await sendMessage("event_queue", { userId, eventId });


      return res.json({ success: true, message: "Registered successfully" });

    } catch (innerErr) {
      //  ROLLBACK: Restore capacity
      await axios.put(
        `http://localhost:5002/events/increase/${eventId}`
      );
      
      // rollback registration 
      if (reg) {
        await Registration.deleteOne({ _id: reg._id });
      }

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

// ================= GET ALL REGISTRATIONS (ADMIN) =================
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (err) {
    console.error("GET ALL REG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET USER REGISTRATIONS =================
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const registrations = await Registration.find({ userId });

    const data = await Promise.all(
      registrations.map(async (r) => {
        try {
          const eventRes = await axios.get(
            `http://localhost:5002/events/${r.eventId}`
          );

          return {
            ...r._doc,
            event: eventRes.data,
          };
        } catch {
          return {
            ...r._doc,
            event: null,
          };
        }
      })
    );

    res.json(data);

  } catch (err) {
    console.error("GET USER REG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= SUBMIT FEEDBACK =================
router.post("/feedback", async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    if (!userId || !eventId || !rating) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const feedback = await Feedback.create({
      userId,
      eventId,
      rating,
      comment,
    });

    res.json({ success: true, feedback });

  } catch (err) {
    console.error("FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET USER FEEDBACK =================
router.get("/feedback/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const feedbacks = await Feedback.find({ userId });

    const data = await Promise.all(
      feedbacks.map(async (f) => {
        try {
          const eventRes = await axios.get(
            `http://localhost:5002/events/${f.eventId}`
          );

          return {
            ...f._doc,
            event: eventRes.data,
          };
        } catch {
          return {
            ...f._doc,
            event: null,
          };
        }
      })
    );

    res.json(data);

  } catch (err) {
    console.error("GET FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL FEEDBACK (ADMIN) =================
router.get("/feedback/all", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    const data = await Promise.all(
      feedbacks.map(async (f) => {
        try {
          const eventRes = await axios.get(
            `http://localhost:5002/events/${f.eventId}`
          );

          return {
            ...f._doc,
            event: eventRes.data,
          };
        } catch {
          return {
            ...f._doc,
            event: null,
          };
        }
      })
    );

    res.json(data);

  } catch (err) {
    console.error("GET ALL FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;