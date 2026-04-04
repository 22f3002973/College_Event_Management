const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.json({ message: "User saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;