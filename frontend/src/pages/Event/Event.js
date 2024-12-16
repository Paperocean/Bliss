import React, { useState } from 'react';
import useAvailableSeats from 'hooks/eventHooks/useAvailableSeats';
import useEvents from 'hooks/eventHooks/useEvents';
import useCart from 'hooks/cartHooks/useCart';
import ErrorMessage from 'components/props/ErrorMessage/ErrorMessage';

const EventTestView = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const {
    seats,
    error: seatsError,
    loading: seatsLoading,
  } = useAvailableSeats(selectedEvent?.event_id);
  const { addSeatToCart, error: cartError } = useCart();

  const handleAddToCart = (seat) => {
    addSeatToCart(seat);
  };

  return (
    <div>
      {(eventsError || seatsError || cartError) && (
        <ErrorMessage message={eventsError || seatsError || cartError} />
      )}
      {eventsLoading ? (
        <p>Loading events...</p>
      ) : !selectedEvent ? (
        <div>
          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            <ul>
              {events.map((event) => (
                <li key={event.event_id}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <button onClick={() => setSelectedEvent(event)}>
                    Select Event
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h2>Select a Seat for {selectedEvent.title}</h2>
          {seatsLoading ? (
            <p>Loading seats...</p>
          ) : seats.length === 0 ? (
            <p>No seats available.</p>
          ) : (
            <ul>
              {seats.map((seat) => (
                <li key={seat.ticket_id}>
                  <span>
                    {seat.seat_label} - {seat.price} zł
                  </span>
                  <button onClick={() => handleAddToCart(seat)}>
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setSelectedEvent(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EventTestView;
