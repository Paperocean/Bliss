import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/props/Button/Button';
import basicCover from 'assets/basic_cover.webp';
import useAvailableSeats from 'hooks/eventHooks/useAvailableSeats';
import './EventBlock.css';

const formatDate = (isoString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(isoString).toLocaleDateString('pl-PL', options);
};

function EventBlock({ event }) {
  const MAX_DESC_LENGTH = 1000;
  const isLongDescription = event.description.length > MAX_DESC_LENGTH;

  const { seats, loading, error } = useAvailableSeats(event.event_id);
  const capacityValue = Number.isInteger(event.capacity) ? event.capacity : 'Brak danych';
  console.log("event.capacity:", event.capacity);
  console.log("event object:", event);
  console.log("event object keys:", Object.keys(event));

  
  return (
    <div className="event-block">
      <div className="event-image">
        <img
          src={event.image || basicCover}
          alt={`Event: ${event.title}`}
          className="event-img"
          loading="lazy"
        />
      </div>
      <div className="event-details">
        <div className="event-header">
          <div className="event-title">{event.title}</div>
          <div className="event-loc-date">
            {event.location},<br />
            {formatDate(event.start_time)}, <br />
            {loading ? (
              <span>Ładowanie dostępnych miejsc...</span>
            ) : error ? (
              <span className="error-message">{error}</span>
            ) : (
              <span>
                Dostępne miejsca: {seats?.length ?? 0} / {event.capacity ?? 'Brak danych'}
              </span>
            )}
          </div>
        </div>
        <div className="event-desc">
          {isLongDescription
            ? `${event.description.substring(0, MAX_DESC_LENGTH)}`
            : event.description}
          {isLongDescription && <Link to={`event/${event.event_id}`}>...</Link>}
        </div>
        <div className="event-footer">
          <div className="event-category category-badge">
            {event.category || 'General'}
          </div>
          <Link to={`event/${event.event_id}`}>
            <Button>Kup bilet</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventBlock;
