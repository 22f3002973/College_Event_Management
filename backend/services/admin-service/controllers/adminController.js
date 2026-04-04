const Event = require("../models/Event");
const Feedback = require("../models/Feedback");
const Registration = require("../models/Registration");
const redisClient = require("../config/redis");

// ============================
// GET ALL EVENTS
// ============================
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// APPROVE EVENT
// ============================
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { returnDocument: "after" }
    );

    // ❗ Clear analytics cache
    await redisClient.del("analytics");

    res.json({ message: "Event approved", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// REJECT EVENT
// ============================
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    // ❗ Clear analytics cache
    await redisClient.del("analytics");

    res.json({ message: "Event rejected", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// ANALYTICS + INSIGHTS (WITH REDIS CACHE)
// ============================
exports.getAnalytics = async (req, res) => {
  try {
    // 🔥 1. Check cache
    const cached = await redisClient.get("analytics");
    if (cached) {
      console.log("Serving from Redis cache");
      return res.json(JSON.parse(cached));
    }

    console.log("Calculating analytics...");

    // EVENTS
    const totalEvents = await Event.countDocuments();
    const approved = await Event.countDocuments({ status: "approved" });
    const pending = await Event.countDocuments({ status: "pending" });
    const rejected = await Event.countDocuments({ status: "rejected" });

    // REGISTRATIONS
    const registrations = await Registration.find();
    const totalRegistrations = registrations.length;

    // FEEDBACK
    const feedbacks = await Feedback.find();
    const totalFeedback = feedbacks.length;

    const avgRating =
      feedbacks.length > 0
        ? Number(
            (
              feedbacks.reduce((sum, f) => sum + f.rating, 0) /
              feedbacks.length
            ).toFixed(1)
          )
        : 0;

    // TOP EVENT
    const eventCountMap = {};
    registrations.forEach((r) => {
      eventCountMap[r.eventId] = (eventCountMap[r.eventId] || 0) + 1;
    });

    let topEventId = null;
    let maxCount = 0;

    for (let id in eventCountMap) {
      if (eventCountMap[id] > maxCount) {
        maxCount = eventCountMap[id];
        topEventId = id;
      }
    }

    let topEvent = null;
    if (topEventId) {
      const event = await Event.findById(topEventId);
      topEvent = { title: event.title, registrations: maxCount };
    }

    // MOST ACTIVE USER
    const userCountMap = {};
    registrations.forEach((r) => {
      userCountMap[r.studentId] =
        (userCountMap[r.studentId] || 0) + 1;
    });

    let topUser = null;
    let maxUserCount = 0;

    for (let user in userCountMap) {
      if (userCountMap[user] > maxUserCount) {
        maxUserCount = userCountMap[user];
        topUser = {
          studentId: user,
          registrations: maxUserCount,
        };
      }
    }

    // HIGHEST RATED EVENT
    const ratingMap = {};
    feedbacks.forEach((f) => {
      if (!ratingMap[f.eventId]) {
        ratingMap[f.eventId] = [];
      }
      ratingMap[f.eventId].push(f.rating);
    });

    let bestEventId = null;
    let bestRating = 0;

    for (let eventId in ratingMap) {
      const ratings = ratingMap[eventId];
      const avg =
        ratings.reduce((a, b) => a + b, 0) / ratings.length;

      if (avg > bestRating) {
        bestRating = avg;
        bestEventId = eventId;
      }
    }

    let highestRatedEvent = null;
    if (bestEventId) {
      const event = await Event.findById(bestEventId);
      highestRatedEvent = {
        title: event.title,
        rating: Number(bestRating.toFixed(1)),
      };
    }

    const result = {
      totalEvents,
      approved,
      pending,
      rejected,
      totalRegistrations,
      totalFeedback,
      avgRating,
      topEvent,
      topUser,
      highestRatedEvent,
    };

    // 🔥 2. Store in Redis (TTL 60 sec)
    await redisClient.setEx("analytics", 60, JSON.stringify(result));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};