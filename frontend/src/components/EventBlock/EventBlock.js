import React from 'react';
import { Link } from 'react-router-dom'
import './EventBlock.css';
import basicCover from 'assets/basic_cover.webp';

function EventBlock({ event }) {
  const MAX_DESC_LENGTH = 1000; 
  const isLongDescription = event.description.length > MAX_DESC_LENGTH;

  return (
    <div className="event-block">
      <div className="event-image">
        <img
          src={event.image || basicCover}
          alt={`Event: ${event.title}`}
          className="event-img"
        />
      </div>
      <div className="event-details">
        <div className="event-title">{event.title}</div>
        <div className="event-desc">
          {isLongDescription
            ? `${event.description.substring(0, MAX_DESC_LENGTH)}`
            : event.description}
          {isLongDescription && <Link to={`event/${event.id}`}>...</Link>}
        </div>
        <div className="event-footer">
          <div className="event-category category-badge">
            {event.category || 'General'}
          </div>
          <div className="buy-ticket-btn">Buy Ticket</div>
        </div>
      </div>
    </div>
  );
}

export default EventBlock;
