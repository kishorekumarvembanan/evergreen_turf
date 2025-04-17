import React from "react";
import "../styles/home.css";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Evergreen Turf</h1>
        <p>Your game. Your time.</p>
        <Link to="/booking" className="book-button">
        Book Now
        </Link>

        </section>

      {/* Price Section */}
      <section className="price">
        <h2>Pricing</h2>
        <p>₹750/hour (Weekdays)</p>
        <p>₹1000/hour (Weekends)</p>
      </section>

      {/* Location Section */}
      <section className="location">
        <h2>Location</h2>
        <p>Evergreen Turf, Oddanchatram.</p>
        <div className="map-container">
        <iframe
        title="Evergreen Turf Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.336243613477!2d77.7328429741377!3d10.497396989642198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9e5004aff4855%3A0xf934b2a18413e166!2sEvergreen%20Turf!5e0!3m2!1sen!2sin!4v1712482446121!5m2!1sen!2sin"
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "8px" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        />

        </div>
      </section>
    </div>
  );
};

export default Home;
