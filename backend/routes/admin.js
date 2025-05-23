const express = require("express");
const router = express.Router();
const {
  getBookingsByDate,
  blockSlot,
  unblockSlot,
  getBlockedSlotsByDate,
} = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/auth");

// Get bookings for a specific date (no auth)
router.get("/bookings", getBookingsByDate);

// Get blocked slots for a specific date (no auth)
router.get("/blocked-slots", getBlockedSlotsByDate);

// Block a slot (still protected)
router.post("/block-slot", blockSlot);

// Unblock a slot (still protected)
router.post("/unblock-slot", protect, isAdmin, unblockSlot);

module.exports = router;
