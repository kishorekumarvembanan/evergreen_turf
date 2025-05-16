// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBookingsByDate,
  blockSlot,
  unblockSlot,
  getBlockedSlotsByDate,
} = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/auth");

// Get bookings for a specific date
router.get("/bookings", protect, isAdmin, getBookingsByDate);

// Get blocked slots for a specific date
router.get("/blocked-slots", protect, isAdmin, getBlockedSlotsByDate);

// Block a slot
router.post("/block-slot", protect, isAdmin, blockSlot);

// Unblock a slot
router.post("/unblock-slot", protect, isAdmin, unblockSlot);

module.exports = router;
