const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.json(user);
});

module.exports = router;