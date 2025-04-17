import React, { useState } from "react";
import "../styles/booking.css";

const Booking = () => {
    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({
      name: "",
      contact: "",
      date: today,
      time: "",
    });
    

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Booking submitted successfully!");
    console.log("Booking Details:", form);
    setForm({ name: "", contact: "", date: "", time: "" }); // clear form
  };
  const timeSlots = [
    "6 AM -7 AM",
    "7 AM -8 AM",
    "5 PM -6 PM",
    "6 PM -7 PM",
    "7 PM -8 PM",
    
    "9 PM -10 PM",
    "10 PM -11 PM",
  ];
  
  // simulate booked slots
  const bookedSlots = [
    "8 PM -9 PM",
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
      className={`time-slot ${form.time === slot ? "selected" : ""} ${bookedSlots.includes(slot) ? "booked" : ""}`}
      onClick={() => setForm({ ...form, time: slot })}
    >
      {slot}
    </button>
  ))}
    </div>
        <button className="submit-button" type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default Booking;
