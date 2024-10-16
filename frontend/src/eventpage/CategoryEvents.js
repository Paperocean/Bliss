import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Sample event data
const allEvents = {
    rock: [
        { id: 1, name: 'Rock Fest', date: '2024-11-15', details: 'An amazing rock festival!', description: 'Join us for an unforgettable night of rock music featuring top bands from around the world. Experience the thrill of live performances and immerse yourself in the rock culture.' },
        { id: 2, name: 'Classic Rock Night', date: '2024-12-20', details: 'Enjoy classic rock hits.', description: 'Relive the golden era of rock music with performances of classic hits. Dance, sing, and celebrate with fellow rock enthusiasts.' },
    ],
    party: [
        { id: 3, name: 'Dance Party', date: '2024-10-30', details: 'Let’s dance the night away!', description: 'Join us for a night filled with dancing, fun, and great music. Enjoy DJ sets and special performances all night long.' },
        { id: 4, name: 'Glow Party', date: '2024-11-10', details: 'An unforgettable glow experience!', description: 'A night of fun with glow sticks, neon lights, and an incredible lineup of DJs. Come dressed in your brightest colors!' },
    ],
};

const CategoryEvents = () => {
    const { category } = useParams();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchEvents = () => {
            setEvents(allEvents[category] || []);
            setLoading(false);
        };
        fetchEvents();
    }, [category]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    if (loading) {
        return <p>Loading events...</p>;
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