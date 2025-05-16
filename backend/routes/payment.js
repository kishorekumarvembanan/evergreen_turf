const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
      amountPaid,
      paymentMode,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature verification failed" });
    }

    const Booking = require("../models/Booking");

    const newBooking = new Booking({
      name: formData.name,
      contact: formData.contact, // ✅ Correct field
      date: formData.date,
      timeSlots: formData.time,
      paymentMode, // ✅ optional but useful
      amountPaid, // ✅ required in schema
      razorpayPaymentId: razorpay_payment_id, // ✅ required in schema
    });

    await newBooking.save();

    res.status(200).json({ success: true, message: "Payment verified and booking successful" });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal server error during verification" });
  }
});


router.post("/checkout", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Could not create Razorpay order",
    });
  }
});


module.exports = router;
