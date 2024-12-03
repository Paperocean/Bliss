import React from 'react';
import '../styles/EventBlock.css';
import basicCover from '../assets/basic_cover.webp';

function EventBlock({ event, index }) {

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
        <div className="event-desc">{event.description}</div>
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
