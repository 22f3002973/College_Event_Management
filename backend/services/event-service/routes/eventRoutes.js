const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const mongoose = require("mongoose");
const redisClient = require("../../../shared/config/redis");
// CREATE EVENT (Organizer)
router.post("/create", async (req, res) => {
  try {
    const { title, description, organizerId } = req.body;

    if (!title || !description || !organizerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.create({
      ...req.body,
      status: "pending"   // force pending
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET events by organizer
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.params.organizerId
    });

    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false });
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
  try {
    // ✅ STEP 1: Check cache
    const cachedData = await redisClient.get("approved_events");

    if (cachedData) {
      console.log("Serving from Redis Cache ⚡");
      return res.json(JSON.parse(cachedData));
    }

    // ✅ STEP 2: Fetch from DB
    const events = await Event.find(
      { status: "approved" },
      "title date venue description capacity createdAt registeredUsers"
    );

    // ✅ STEP 3: Store in Redis (with expiry)
    await redisClient.setEx(
      "approved_events",
      60, // seconds
      JSON.stringify(events)
    );

    console.log("Serving from DB & caching result 🗄️");

    res.json(events);
  } catch (err) {
    console.error("Error fetching approved events:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PENDING EVENTS (Admin)
router.get("/pending", async (req, res) => {
  const events = await Event.find({ status: "pending" });
  res.json(events);
});

// APPROVE EVENT (Admin)
router.put("/approve/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    //  Invalidate cache
    await redisClient.del("approved_events");

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error approving event" });
  }
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

    res.json(event);
  } catch (err) {
    console.error("Error increasing capacity:", err);
    res.status(500).json({ message: "Failed to increase capacity" });
  }
});

module.exports = router;
