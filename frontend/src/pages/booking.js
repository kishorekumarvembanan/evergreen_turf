import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios
import "../styles/booking.css";
import Swal from "sweetalert2";

const Booking = () => {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: today,
    time: [],
    paymentOption: "advance",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [bookedSlots, setBookedSlots] = useState([]);
  const fullAmountPerSlot = 500;
  const advancePerSlot = 50;

  const calculateAmount = () => {
    const slots = form.time.length;
    if (form.paymentOption === "full") {
      return fullAmountPerSlot * slots;
    } else {
      return advancePerSlot * slots;
    }
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/booking/${form.date}`);
        setBookedSlots(response.data);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    fetchBookedSlots();
  }, [form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(form.contact)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    const numberOfSlots = form.time.length;
    if (numberOfSlots === 0) {
      alert("Please select at least one time slot.");
      return;
    }

    const amount =
      form.paymentOption === "advance"
        ? advancePerSlot * numberOfSlots // convert to paise
        : fullAmountPerSlot * numberOfSlots ; // in paise

    try {
      const orderRes = await axios.post("http://127.0.0.1:5001/api/payment/checkout", {
        amount,
      });
      
      
      const { order } = orderRes.data;
      const { id: orderId, currency } = order;
      
      const options = {
        key: "rzp_test_tXUhiIbyvL0HuO", // replace with your key
        amount,
        currency,
        name: "Evergreen Turf",
        description: `${form.paymentOption} Booking - ${numberOfSlots} slot(s)`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("http://127.0.0.1:5001/api/payment/verify", {
              ...response,
              formData: form,
              amountPaid: amount / 100,
              paymentMode: form.paymentOption,
            });

            if (verifyRes.data.success) {
              Swal.fire("Success!", "Payment & booking successful!", "success");
              setForm({
                name: "",
                contact: "",
                date: form.date,
                time: [],
                paymentOption: "advance",
              });
              const updated = await axios.get(`http://127.0.0.1:5001/api/booking/${form.date}`);
              setBookedSlots(updated.data);
            } else {
              Swal.fire("Error", "Payment verification failed!", "error");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            Swal.fire("Error", "Payment failed!", "error");
          }
        },
        prefill: {
          name: form.name,
          contact: form.contact,
        },
        theme: {
          color: "#00a86b",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment Init Error:", err);
      Swal.fire("Error", "Could not initiate payment!", "error");
    }
  };

  const timeSlots = [
    "6:00 AM - 6:30 AM", "6:30 AM - 7:00 AM",
    "7:00 AM - 7:30 AM", "7:30 AM - 8:00 AM",
    "8:00 AM - 8:30 AM", "8:30 AM - 9:00 AM",
    "4:30 PM - 5:00 PM", "5:00 PM - 5:30 PM",
    "5:30 PM - 6:00 PM", "6:00 PM - 6:30 PM",
    "6:30 PM - 7:00 PM", "7:00 PM - 7:30 PM",
    "7:30 PM - 8:00 PM", "8:00 PM - 8:30 PM",
    "8:30 PM - 9:00 PM", "9:00 PM - 9:30 PM",
    "9:30 PM - 10:00 PM", "10:00 PM - 10:30 PM",
    "10:30 PM - 11:00 PM"
  ];

  return (
    <div className="booking-container">
      <h2>Book Your Slot</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <div className="time-slot-container">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              disabled={bookedSlots.includes(slot)}
              className={`time-slot ${form.time.includes(slot) ? "selected" : ""} ${
                bookedSlots.includes(slot) ? "booked" : ""
              }`}
              onClick={() => {
                if (form.time.includes(slot)) {
                  // Deselect the slot
                  setForm({ ...form, time: form.time.filter((s) => s !== slot) });
                } else {
                  // Select the slot
                  setForm({ ...form, time: [...form.time, slot] });
                }
              }}
            >
              {slot}
            </button>
          ))}
        </div>
        <select
          name="paymentOption"
          value={form.paymentOption}
          onChange={handleChange}
          required
          className="payment-select"
        >
          <option value="advance">Pay Advance ₹{advancePerSlot} / slot</option>
          <option value="full">Pay Full ₹{fullAmountPerSlot} / slot</option>
        </select>

        <div className="payment-amount">
          Total to Pay: ₹{calculateAmount()}
        </div>

        <button className="submit-button" type="submit" disabled={!form.time}>
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Booking;
