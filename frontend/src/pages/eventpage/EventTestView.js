import React, { useState, useEffect } from 'react';
import useAvailableSeats from '../../hooks/useAvailableSeats';
import ErrorMessage from '../../components/ErrorMessage';
import { fetchEvents } from '../../services/eventService';

const EventTestView = () => {
    const [events, setEvents] = useState([]); 
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const { seats, error, loading } = useAvailableSeats(selectedEvent?.event_id);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [fetchError, setFetchError] = useState(null); 

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const response = await fetchEvents();
                setEvents(response.events || []);
            } catch (err) {
                console.error('Error fetching events:', err.message);
                setFetchError('Failed to load events. Please try again later.');
            }
        };

        loadEvents();
    }, []);

    const handleAddToCart = () => {
        if (!selectedSeat) {
            alert('Please select a seat before adding to cart.');
            return;
        }
        console.log('Adding seat to cart:', selectedSeat);
    };

    return (
        <div>
            <h1>Available Events</h1>
            {fetchError && <ErrorMessage message={fetchError} />}
            {!selectedEvent ? (
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
                    {loading ? (
                        <p>Loading seats...</p>
                    ) : seats.length === 0 ? (
                        <p>No seats available.</p>
                    ) : (
                        <ul>
                            {seats.map((seat) => (
                                <li key={seat.ticket_id}>
                                    {seat.seat_label} - ${seat.price}{' '}
                                    <button onClick={() => setSelectedSeat(seat)}>Select</button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <button onClick={handleAddToCart}>Add to Cart</button>
                    <button onClick={() => setSelectedEvent(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default EventTestView;
