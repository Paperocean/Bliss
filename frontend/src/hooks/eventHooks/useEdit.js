// ParentComponent.js
import React, { useState, useEffect } from 'react';
import EventBlock from './EventBlock';
import { getEventsRequest } from '../../services/eventService';

function ParentComponent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEventsRequest();
        setEvents(data);
      } catch (err) {
        setError('Nie udało się załadować wydarzeń.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) return <p>Ładowanie wydarzeń...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {events.map((event) => (
        <EventBlock key={event.event_id} event={event} />
      ))}
    </div>
  );
}

export default ParentComponent;
