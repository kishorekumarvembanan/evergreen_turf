const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// Simple test route
router.get("/", (req, res) => {
  res.send("Booking route working!");
});

// Optional: post a new booking
router.post("/", async (req, res) => {
  try {
    const { name, date, slot } = req.body;
    const newBooking = new Booking({ name, date, slot });
    await newBooking.save();
    res.status(201).json({ message: "Booking created", booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

module.exports = router;
