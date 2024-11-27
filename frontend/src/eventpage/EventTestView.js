import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/eventService'

const EventTestView = () => {
    const [events, setEvents] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEvents();
                if (data.success) {
                    setEvents(data.events);
                    setErrorMessage('');
                } else {
                    setErrorMessage(data.message);
                }
            } catch (error) {
                setErrorMessage(error.message || 'Error fetching events', error);
            }
        };

        loadEvents();

    }, []);

    return (
        <div>
            <h1>Available Events</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {events.map((event) => (
                <div key={event.event_id}>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p>Location: {event.location}</p>
                    <p>Start: {new Date(event.start_time).toLocaleString()}</p>
                    <p>End: {new Date(event.end_time).toLocaleString()}</p>
                    <p>Category: {event.category}</p>
                    <p>Available Tickets: {event.available_tickets}</p>
                </div>
            ))}
        </div>
    );
};

export default EventTestView;
