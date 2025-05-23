import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const BASE_URL = "https://enthusiastic-friendship-production.up.railway.app/api";

const AdminDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [bookings, setBookings] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [message, setMessage] = useState("");

  const slots = [
    "6:00 AM - 6:30 AM",
    "6:30 AM - 7:00 AM",
    "7:00 AM - 7:30 AM",
    "7:30 AM - 8:00 AM",
    "8:00 AM - 8:30 AM",
    "8:30 AM - 9:00 AM",
    "4:30 PM - 5:00 PM",
    "5:00 PM - 5:30 PM",
    "5:30 PM - 6:00 PM",
    "6:00 PM - 6:30 PM",
    "6:30 PM - 7:00 PM",
    "7:00 PM - 7:30 PM",
    "7:30 PM - 8:00 PM",
    "8:00 PM - 8:30 PM",
    "8:30 PM - 9:00 PM",
    "9:00 PM - 9:30 PM",
    "9:30 PM - 10:00 PM",
    "10:00 PM - 10:30 PM",
    "10:30 PM - 11:00 PM",
  ];

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookingsAndBlocked = async () => {
      try {
        const [bookingsRes, blockedRes] = await Promise.all([
          axios.get(`${BASE_URL}/admin/bookings?date=${selectedDate}`),
          axios.get(`${BASE_URL}/admin/blocked-slots?date=${selectedDate}`),
        ]);
        setBookings(bookingsRes.data);
        setBlockedSlots(blockedRes.data);
        setMessage("");
      } catch (error) {
        setMessage("Failed to load bookings/blocked slots.");
        console.error(error);
      }
    };

    fetchBookingsAndBlocked();
  }, [selectedDate]);

  const isBooked = (slot) => {
    return bookings.some((booking) => booking.timeSlots.includes(slot));
  };

  const isBlocked = (slot) => {
    return blockedSlots.some((b) => b.slot === slot);
  };

  const blockSlot = async (slot) => {
    if (!selectedDate) {
      setMessage("Please select a date first.");
      return;
    }
    if (isBooked(slot)) {
      setMessage("Cannot block a slot that is already booked.");
      return;
    }
    if (isBlocked(slot)) {
      setMessage("Slot already blocked.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/admin/block-slot`, { date: selectedDate, slot });
      setBlockedSlots([...blockedSlots, { date: selectedDate, slot }]);
      setMessage("Slot blocked successfully.");
    } catch (error) {
      setMessage("Failed to block slot.");
      console.error(error);
    }
  };

  const unblockSlot = async (slot) => {
    if (!selectedDate) {
      setMessage("Please select a date first.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/admin/unblock-slot`, { date: selectedDate, slot });
      setBlockedSlots(blockedSlots.filter((b) => b.slot !== slot));
      setMessage("Slot unblocked successfully.");
    } catch (error) {
      setMessage("Failed to unblock slot.");
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <label>
        Select Date:{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
        />
      </label>
      {message && <div className="message">{message}</div>}
      <div className="slots-grid">
        {slots.map((slot) => (
          <div key={slot} className="slot-item">
            <span>{slot}</span>
            {isBooked(slot) ? (
              <button disabled className="booked-btn">
                Booked
              </button>
            ) : isBlocked(slot) ? (
              <button onClick={() => unblockSlot(slot)} className="unblock-btn">
                Unblock
              </button>
            ) : (
              <button onClick={() => blockSlot(slot)} className="block-btn">
                Block
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
