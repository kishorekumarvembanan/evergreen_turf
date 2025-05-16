// controllers/adminController.js
const Booking = require("../models/Booking");
const BlockedSlot = require("../models/Blockedslot");

const getBookingsByDate = async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "Date is required" });
    const bookings = await Booking.find({ date });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getBlockedSlotsByDate = async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "Date is required" });
    const blockedSlots = await BlockedSlot.find({ date });
    res.json(blockedSlots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const blockSlot = async (req, res) => {
  try {
    const { date, slot } = req.body;
    if (!date || !slot)
      return res.status(400).json({ message: "Date and slot required" });

    // Check if slot already booked
    const existingBooking = await Booking.findOne({
      date,
      timeSlots: slot,
    });
    if (existingBooking)
      return res.status(400).json({ message: "Slot already booked" });

    // Check if slot already blocked
    const existingBlock = await BlockedSlot.findOne({ date, slot });
    if (existingBlock)
      return res.status(400).json({ message: "Slot already blocked" });

    const block = new BlockedSlot({ date, slot });
    await block.save();
    res.status(201).json({ message: "Slot blocked" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const unblockSlot = async (req, res) => {
  try {
    const { date, slot } = req.body;
    if (!date || !slot)
      return res.status(400).json({ message: "Date and slot required" });

    await BlockedSlot.findOneAndDelete({ date, slot });
    res.status(200).json({ message: "Slot unblocked" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBookingsByDate,
  getBlockedSlotsByDate,
  blockSlot,
  unblockSlot,
};
