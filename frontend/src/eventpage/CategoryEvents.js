import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryEvents = () => {
    const { category } = useParams();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchEvents = async () => {
            try {
                const response = await axios.get(`/api/events?category=${category}`);
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [category]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    if (loading) {
        return <p>Loading events...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!events.length) {
        return <p>No events available for this category.</p>;
    }

    return (
        <div className="category-events-container">
            <h1 className="category-header">{category.charAt(0).toUpperCase() + category.slice(1)} Events</h1>
            <div className="events-layout">
                <ul className="event-list">
                    {events.map((event) => (
                        <li key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
                            {event.name}
                        </li>
                    ))}
                </ul>
                {selectedEvent && (
                    <div className="event-details animated-details">
                        <h2>{selectedEvent.name}</h2>
                        <p><strong>Date:</strong> {selectedEvent.date}</p>
                        <p><strong>Details:</strong> {selectedEvent.details}</p>
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryEvents;
