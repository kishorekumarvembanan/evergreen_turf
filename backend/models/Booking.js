const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlots: { type: [String], required: true }, // multiple slots per booking
    paymentMode: { type: String, enum: ["advance", "full"], default: "advance" },
    amountPaid: { type: Number, required: true },
    razorpayPaymentId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);