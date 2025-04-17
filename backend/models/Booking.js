// models/booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  contact: String,
  date: String,
  time: String,
});

module.exports = mongoose.model("Booking", bookingSchema);
