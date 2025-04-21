const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

router.post("/", async (req, res) => {
  try {
    const { name, mobile, date, timeSlot } = req.body;

    const existingBooking = await Booking.findOne({ date, timeSlot });

    if (existingBooking) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const booking = new Booking({ name, mobile, date, timeSlot });
    await booking.save();

    res.status(201).json({ message: "Slot booked successfully", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
