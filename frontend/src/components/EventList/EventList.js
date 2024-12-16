import React from 'react';
import EventBlock from '../EventBlock/EventBlock';
import EventBlockOrganizer from 'components/EventOrganizatorBlock/EventBlock';
import './EventList.css';

function EventList({ events, role }) {
  return (
    <div className="event-list-window">
      {events.length === 0 ? (
        <p>Brak dostępnych wydarzeń.</p>
      ) : (

        role === 'organizer' ? (
          events.map((event) => 
          <EventBlockOrganizer key={event.event_id} event={event} />
        )
        ) : (
          events.map((event) => (
            <EventBlock key={event.event_id} event={event} />
          ))
        )
      )}
    </div>
  );
}

export default EventList;
