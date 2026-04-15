const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase().trim(); // ✅ ADD THIS

    const user = await User.create(req.body);

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// LOGIN
// LOGIN (FIXED)
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    const user = await User.findOne({ email, password });

    if (!user) {
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

// UPDATE USER PROFILE
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, department } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, department },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user: updatedUser });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// CHANGE PASSWORD
router.put("/change-password/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ check current password
    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ✅ update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;