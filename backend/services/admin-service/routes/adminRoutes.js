const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/events", adminController.getAllEvents);
router.patch("/approve/:id", adminController.approveEvent);
router.patch("/reject/:id", adminController.rejectEvent);
router.get("/analytics", adminController.getAnalytics);

module.exports = router;