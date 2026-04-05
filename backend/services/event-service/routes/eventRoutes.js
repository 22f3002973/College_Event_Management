const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const mongoose = require("mongoose");

// CREATE EVENT (Organizer)
router.post("/create", async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});

// APPROVED EVENTS (Student)
router.get("/approved", async (req, res) => {
  const events = await Event.find({ status: "approved" }, "title date venue description capacity createdAt registeredUsers");
  res.json(events);
});

// PENDING EVENTS (Admin)
router.get("/pending", async (req, res) => {
  const events = await Event.find({ status: "pending" });
  res.json(events);
});

// APPROVE EVENT (Admin)
router.put("/approve/:id", async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json(event);
});

// GET SINGLE EVENT
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a user to registeredUsers array as string
router.put("/addRegisteredUser/:id", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { registeredUsers: userId.toString() } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error in addRegisteredUser:", err);
    res.status(500).json({ message: "Failed to add user" });
  }
});

// REDUCE CAPACITY (Concurrency Safe)
router.put("/reduce/:id", async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, capacity: { $gt: 0 } },
    { $inc: { capacity: -1 } },
    { new: true }
  );

  if (!event) return res.json({ message: "Full" });

  res.json(event);
});

module.exports = router;