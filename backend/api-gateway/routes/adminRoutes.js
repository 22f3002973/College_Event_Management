const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/analytics", async (req, res) => {
  try {
    const [eventsRes, regRes, feedbackRes] = await Promise.all([
      axios.get("http://localhost:5002/events"),
      axios.get("http://localhost:5003/register"),
      axios.get("http://localhost:5003/register/feedback/all"),
    ]);

    const events = eventsRes.data || [];
    const registrations = regRes.data || [];
    const feedback = feedbackRes.data || [];

    // ===== BASIC =====
    const totalEvents = events.length;
    const totalRegistrations = registrations.length;
    const totalFeedback = feedback.length;

    const approved = events.filter(e => e.status === "approved").length;
    const pending = events.filter(e => e.status === "pending").length;
    const rejected = events.filter(e => e.status === "rejected").length;

    // ===== TOP EVENT =====
    const eventCount = {};
    registrations.forEach(r => {
      const id = String(r.eventId);
      eventCount[id] = (eventCount[id] || 0) + 1;
    });

    let topEvent = null;
    let max = 0;

    for (let id in eventCount) {
      if (eventCount[id] > max) {
        max = eventCount[id];
        const event = events.find(e => String(e._id) === id);

        if (event) {
          topEvent = {
            title: event.title,
            registrations: max,
          };
        }
      }
    }

    // ===== TOP USER =====
    const userCount = {};
    registrations.forEach(r => {
      if (!r.userId) return;
      userCount[r.userId] = (userCount[r.userId] || 0) + 1;
    });

    let topUser = null;
    let maxUser = 0;

    for (let id in userCount) {
      if (userCount[id] > maxUser) {
        maxUser = userCount[id];
        topUser = {
          studentId: id,
          registrations: maxUser,
        };
      }
    }

    // ===== HIGHEST RATED EVENT =====
    const ratingMap = {};

    feedback.forEach(f => {
      const id = String(f.eventId);

      if (!ratingMap[id]) {
        ratingMap[id] = { total: 0, count: 0 };
      }

      ratingMap[id].total += f.rating;
      ratingMap[id].count += 1;
    });

    let highestRatedEvent = null;
    let bestRating = 0;

    for (let id in ratingMap) {
      const avg = ratingMap[id].total / ratingMap[id].count;

      if (avg > bestRating) {
        bestRating = avg;

        const event = events.find(e => String(e._id) === id);

        if (event) {
          highestRatedEvent = {
            title: event.title,
            rating: avg.toFixed(1),
          };
        }
      }
    }

    // ===== AVG RATING =====
    const avgRating =
      feedback.length > 0
        ? (
            feedback.reduce((sum, f) => sum + f.rating, 0) /
            feedback.length
          ).toFixed(1)
        : 0;

    res.json({
      totalEvents,
      totalRegistrations,
      totalFeedback,
      approved,
      pending,
      rejected,
      topEvent,
      topUser,
      highestRatedEvent,
      avgRating,
    });

  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ message: "Analytics error" });
  }
});

module.exports = router;