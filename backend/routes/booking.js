const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

router.post("/", async (req, res) => {
  try {
    const { name, mobile, date, timeSlots } = req.body;

    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({ message: "No time slots selected" });
    }

    // Check for already booked slots
    const existingBookings = await Booking.find({ date });
    const alreadyBooked = existingBookings.flatMap(b => b.timeSlots);

    const overlap = timeSlots.filter(slot => alreadyBooked.includes(slot));

    if (overlap.length > 0) {
      return res.status(400).json({ message: "Some slots are already booked", alreadyBooked: overlap });
    }

    const newBooking = new Booking({ name, mobile, date, timeSlots });
    await newBooking.save();

    res.status(201).json({ message: "Slots booked successfully", newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all booked slots for a specific date
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await Booking.find({ date });

    const bookedSlots = bookings.flatMap(booking => booking.timeSlots);
    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
