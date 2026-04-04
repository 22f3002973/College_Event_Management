const express = require("express");
const router = express.Router();

const { submitFeedback } = require("../controllers/feedbackController");

router.post("/", submitFeedback);
router.get("/", async (req, res) => {
  const Feedback = require("../models/Feedback");
  const data = await Feedback.find();
  res.json(data);
});

module.exports = router;