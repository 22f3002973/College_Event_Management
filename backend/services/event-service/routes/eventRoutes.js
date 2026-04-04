const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// CREATE EVENT (Organizer)
router.post("/create", async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});

// APPROVED EVENTS (Student)
router.get("/approved", async (req, res) => {
  const events = await Event.find({ status: "approved" });
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
  const event = await Event.findById(req.params.id);
  res.json(event);
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