const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { studentId, eventId, rating, comment } = req.body;

    const feedback = await Feedback.create({
      studentId,
      eventId,
      rating,
      comment,
    });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};