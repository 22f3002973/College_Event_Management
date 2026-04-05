const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// CREATE EVENT (Organizer)
router.post("/create", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body); // debug

    const event = await Event.create(req.body);

    res.json(event);
  } catch (error) {
    console.error("Error while creating event:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET events by organizer
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.params.organizerId
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE EVENT (Organizer)
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Prevent editing if already approved
    if (event.status === "approved") {
      return res.status(400).json({ message: "Approved event cannot be edited" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE EVENT (Organizer)
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Optional rule (recommended like update)
    if (event.status === "approved") {
      return res.status(400).json({ message: "Approved event cannot be deleted" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//REJECT THE EVENT BY ADMIN
router.put("/reject/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
