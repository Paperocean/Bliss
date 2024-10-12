import React from 'react';
import '../App.css';
import Header from '../homepage/Header'; // Zaimportowany Header z Homepage
import Footer from '../homepage/Footer'; // Zaimportowany Footer z Homepage

const EventPage = () => {
  return (
    <div className="app">
        <div className="container">
        <Header /> {/* Użycie Headera z Homepage */}
        <main className="event-main">
          <section className="event-details">
            <h2>Event Details</h2>
            <p>Details about the event will go here.</p>
          </section>
          <section className="event-schedule">
            <h2>Event Schedule</h2>
            <p>Schedule of the event will go here.</p>
          </section>
        </main>
        <Footer /> {/* Użycie Footera z Homepage */}
      </div>
    </div>
  );
};

export default EventPage;