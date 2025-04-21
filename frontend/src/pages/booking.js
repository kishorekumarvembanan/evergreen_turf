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
    time: "", // Initialize time as empty string
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [bookedSlots, setBookedSlots] = useState([]);

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
}, [form.date]); // runs every time the date changes


const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate mobile number (basic check: must be 10 digits)
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(form.contact)) {
    alert("Please enter a valid 10-digit mobile number starting with 6-9.");
    return;
  }

  try {
    const response = await axios.post("http://127.0.0.1:5001/api/booking", {
      ...form,
      timeSlot: form.time,
      mobile: form.contact, // backend expects `mobile`
    });

    console.log("Booking response:", response);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Booking submitted successfully!",
      confirmButtonColor: "#3085d6",
    });
    
    setForm({ name: "", contact: "", date: form.date, time: "" });

    const updated = await axios.get(`http://127.0.0.1:5001/api/booking/${form.date}`);
    setBookedSlots(updated.data);
  } catch (error) {
    console.error("Error booking slot:", error);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Booking submitted successfully!",
      confirmButtonColor: "#3085d6",
    });
      }
};



  const timeSlots = [
    "6 AM -7 AM",
    "7 AM -8 AM",
    "8 AM -9 AM",
    "5 PM -6 PM",
    "6 PM -7 PM",
    "7 PM -8 PM",
    "8 PM -9 PM",
    "9 PM -10 PM",
    "10 PM -11 PM",
  ];

  // Simulate booked slots
  

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
              className={`time-slot ${form.time === slot ? "selected" : ""} ${
                bookedSlots.includes(slot) ? "booked" : ""
              }`}
              onClick={() => setForm({ ...form, time: slot })}
            >
              {slot}
            </button>
          ))}
        </div>
        <button className="submit-button" type="submit" disabled={!form.time}>
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Booking;
