import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/props/Button/Button';
import EditEventModal from 'pages/Event/EditEventModal';

import basicCover from 'assets/basic_cover.webp';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="event-header">
          <div className="event-title">{event.title}</div>
          <div className="event-loc-date">
            {event.location},<br />
            {formatDate(event.start_time)}
          </div>
        </div>
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
          <Button onClick={() => setIsModalOpen(true)}>Edytuj wydarzenie</Button>{' '}
          <EditEventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default EventBlock;
