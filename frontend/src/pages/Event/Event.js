import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useEvent from 'hooks/eventHooks/useEvent';
import useAvailableSeats from 'hooks/eventHooks/useAvailableSeats';

import basicCover from 'assets/basic_cover.webp';
import './Event.css';

import Button from 'components/props/Button/Button';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';

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

function EventPage() {
  const { event_id } = useParams();
  const { event, loading: eventLoading, error: eventError } = useEvent(event_id);
  const { seats, loading: seatsLoading, error: seatsError } = useAvailableSeats(event_id);
  const cheapestPrice = seats.length > 0 ? Math.min(...seats.map((seat) => seat.price)) : null;

  if (eventLoading || seatsLoading) {
    return <div className="loading">Ładowanie...</div>;
  }

  if (eventError || seatsError) {
    return <div className="error">{eventError || seatsError}</div>;
  }

  return (
    <ContentWrapper>
      <div className="event-page">
        <div className="event-main-content">
          {/* Left Column */}
          <div className="event-left-column">
            <div className="event-image">
              <img
                src={event.image || basicCover}
                alt={`Event: ${event.title}`}
                className="event-img"
              />
            </div>
            <div className="event-footer">
              <Button>
                {cheapestPrice !== null ? `Kup bilet od ${cheapestPrice.toFixed(2)} zł` : 'Kup bilet'}
              </Button>            
            </div>
          </div>

          {/* Right Column */}
          <div className="event-right-column">
            <h1 className="event-title">{event.title}</h1>
            <div className="category-badge">{event.category_name || 'General'}</div>
            <div className="event-loc-date">
              {event.location}
              <br />
              {formatDate(event.start_time)}
            </div>
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet ligula convallis, eleifend nisi vitae, sodales quam. Donec aliquet cursus massa id elementum. Donec molestie, orci vel bibendum egestas, libero mauris sodales justo, quis bibendum mi metus ornare metus. Aenean hendrerit tellus et gravida efficitur. Fusce quis tincidunt mi. In volutpat porta orci, pretium placerat lacus malesuada a. Vestibulum pharetra tincidunt eros, id molestie ipsum blandit at. Cras porttitor elementum maximus. Praesent iaculis libero eget laoreet auctor.

Etiam sed dapibus ante. Morbi malesuada placerat semper. Nam in nisl ut magna volutpat porttitor nec vel dolor. Nullam sit amet imperdiet augue, laoreet feugiat ligula. Fusce ac posuere sapien, in congue mauris. Fusce vulputate tortor ullamcorper orci porta, posuere suscipit tortor finibus. Duis sit amet efficitur nisl. Proin dapibus, magna mollis pellentesque interdum, lectus risus tempus tortor, at hendrerit diam dolor et leo. Nam eu tincidunt ligula. Vivamus sollicitudin, justo id cursus gravida, tellus est lacinia ante, eget mattis risus magna non justo. Proin suscipit ex sit amet augue pellentesque, vitae lobortis dolor aliquet. Nullam et vehicula justo. Nullam nec felis id est commodo imperdiet vitae vel mi.

Nulla non magna vitae felis sollicitudin ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ac tincidunt sem. Nunc at posuere orci. Quisque eget augue eget lectus vulputate porta a sit amet magna. Proin eget lorem velit. Curabitur rutrum eu dui tincidunt ultricies. Praesent dictum sapien id nibh maximus, ut dignissim libero hendrerit. Nam a eros semper, feugiat elit vel, vulputate diam. In nec risus ut risus pretium ullamcorper. Sed dignissim diam non quam rutrum dictum. In vel tempus ex. Aliquam quis massa finibus, maximus odio ac, suscipit nisl. Nunc dictum quis ligula vel vulputate. In interdum metus id elit mollis tempus.
              </p>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}

export default EventPage;
