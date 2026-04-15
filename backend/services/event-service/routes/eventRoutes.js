const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const mongoose = require("mongoose");
const redisClient = require("../../../shared/config/redis");

// ================= CREATE EVENT =================
router.post("/create", async (req, res) => {
  try {
    const { title, description, organizerId } = req.body;

    if (!title || !description || !organizerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.create({
      ...req.body,
      status: "pending",
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= GET ALL EVENTS (✅ ADDED FOR ADMIN) =================
router.get("/", async (req, res) => {
  const events = await Event.find();

  const updated = events.map(e => ({
    ...e._doc,
    registeredCount: e.registeredUsers.length,
    availableSeats: e.capacity - e.registeredUsers.length
  }));

  res.json(updated);
});
// ================= GET EVENTS BY ORGANIZER =================
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.params.organizerId,
    });

    const updated = events.map(e => ({
      ...e._doc,
      registeredCount: e.registeredUsers.length,
      availableSeats: e.capacity - e.registeredUsers.length
    }));

    res.json({ success: true, events: updated });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ================= UPDATE EVENT =================
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "approved") {
      return res.status(400).json({
        message: "Approved event cannot be edited",
      });
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

// ================= DELETE EVENT =================
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "approved") {
      return res.status(400).json({
        message: "Approved event cannot be deleted",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= PENDING EVENTS =================
router.get("/pending", async (req, res) => {
  const events = await Event.find({ status: "pending" });
  res.json(events);
});

// ================= APPROVED EVENTS =================
router.get("/approved", async (req, res) => {
  try {
    const cachedData = await redisClient.get("approved_events");

    if (cachedData) {
      console.log("Serving from Redis Cache ");
      return res.json(JSON.parse(cachedData));
    }

    const events = await Event.find({ status: "approved" });

    await redisClient.setEx(
      "approved_events",
      60,
      JSON.stringify(events)
    );

    console.log("Serving from DB & caching result ");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= APPROVE EVENT =================
router.put("/approve/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    await redisClient.del("approved_events");

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error approving event" });
  }
});

// ================= REJECT EVENT =================
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

// ================= GET SINGLE EVENT =================
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= REGISTER USER =================
router.put("/addRegisteredUser/:id", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        registeredUsers: { $ne: userId.toString() } // prevent duplicate
      },
      {
        $addToSet: { registeredUsers: userId.toString() }
      },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ message: "User already registered or event not found" });
    }

    res.json(event);

  } catch (err) {
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

  await redisClient.del("approved_events");

  res.json(event);
});

// INCREASE CAPACITY (Rollback Support)
router.put("/increase/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { capacity: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await redisClient.del("approved_events");

    res.json(event);
  } catch (err) {
    console.error("Error increasing capacity:", err);
    res.status(500).json({ message: "Failed to increase capacity" });
  }
});

module.exports = router;