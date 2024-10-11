import React from 'react';
import './Eventpage.css';

const EventPage = () => {
  return (
    <div className="eventpage">
      <div className="container">
        <header className="event-header">
          <h1>Event Page</h1>
        </header>
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
      </div>
    </div>
  );
};

export default EventPage;