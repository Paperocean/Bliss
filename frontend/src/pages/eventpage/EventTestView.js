import React, { useState } from 'react';
import useAvailableSeats from '../../hooks/useAvailableSeats';
import useEvents from '../../hooks/useEvents';
import useCart from '../../hooks/useCart';
import ErrorMessage from '../../components/ErrorMessage';

const EventTestView = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { events, loading: eventsLoading, error: eventsError } = useEvents();
    const { seats, error: seatsError, loading: seatsLoading } = useAvailableSeats(selectedEvent?.event_id);
    const { addSeatToCart, error: cartError } = useCart(); 

    const handleAddToCart = (seat) => {
        console.log('Seat being added:', seat);

        const seatWithNumericPrice = {
            ...seat,
            price: parseFloat(seat.price),
        };

        if (!seatWithNumericPrice || !seatWithNumericPrice.ticket_id || typeof seatWithNumericPrice.price !== 'number') {
            console.error('Invalid seat data:', seatWithNumericPrice);
            return alert('Cannot add seat to cart. Missing required information.');
        }
    
        addSeatToCart(seatWithNumericPrice);
    };

    return (
        <div>
            <h1>Available Events</h1>

            <button onClick={() => window.location.href = '/cart'}>Go to Cart</button>

            {(eventsError || seatsError || cartError) && (
                <ErrorMessage message={eventsError || seatsError || cartError} />
            )}
            {eventsLoading ? (
                <p>Loading events...</p>
            ) : !selectedEvent ? (
                <div>
                    <h2>Select an Event</h2>
                    {events.length === 0 ? (
                        <p>No events available.</p>
                    ) : (
                        <ul>
                            {events.map((event) => (
                                <li key={event.event_id}>
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                    <button onClick={() => setSelectedEvent(event)}>Select Event</button>
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
                                        {seat.seat_label} - ${seat.price}
                                    </span>
                                    <button onClick={() => handleAddToCart(seat)}>Add to Cart</button>
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
