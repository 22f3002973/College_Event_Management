const express = require("express");
const router = express.Router();

// 🔥 Import FULL controller (not destructuring)
const registrationController = require("../controllers/registrationController");

router.post("/", registrationController.registerEvent);

router.get("/", async (req, res) => {
  const Registration = require("../models/Registration");
  const data = await Registration.find();
  res.json(data);
});

module.exports = router;