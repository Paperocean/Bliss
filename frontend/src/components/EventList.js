import React from 'react';
import EventBlock from './EventBlock';
import '../styles/EventList.css';

function EventList({ events }) {
  return (
    <div className="event-list-window">
      {events.length === 0 ? (
        <p>Brak dostępnych wydarzeń.</p>
      ) : (
        events.map((event) => <EventBlock key={event.event_id} event={event} />)
      )}
    </div>
  );
}

export default EventList;
