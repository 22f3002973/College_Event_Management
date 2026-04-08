const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();

    // ✅ CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      ...req.body,
      email
    });

    res.status(201).json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// LOGIN
// LOGIN (FIXED)
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    console.log("LOGIN INPUT:", email, password); // ✅ DEBUG

    const user = await User.findOne({ email });

    console.log("FOUND USER:", user); // ✅ DEBUG

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let user = null;

    // Try ObjectId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select("-password");
    }

    // fallback (optional)
    if (!user) {
      user = await User.findOne({ userId }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;