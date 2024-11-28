import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventsByCategory } from '../../services/eventService';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';
import './Eventpage.css';

const CategoryEvents = () => {
    const { category } = useParams();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchEventsByCategory(category);
                setEvents(response.events || []);
            } catch (err) {
                console.error('Error fetching events by category:', err.message);
                setError('Failed to fetch events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [category]);

    const handleEventClick = (event) => {
        setSelectedEvent({
            name: event.name,
            description: event.description,
            location: event.location,
            eventDate: new Date(event.event_date).toLocaleDateString(),
        });
    };

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>{error}</p>;
    if (!events.length) return <p>No events available for this category.</p>;

    return (
        <div className="container">
            <Header />
            <div className="category-events-container">
                <h1 className="category-header">
                    {category.charAt(0).toUpperCase() + category.slice(1)} Events
                </h1>
                <div className="events-layout">
                    <ul className="event-list">
                        {events.map((event) => (
                            <li
                                key={event.id}
                                className="event-item"
                                onClick={() => handleEventClick(event)}
                            >
                                {event.name}
                            </li>
                        ))}
                    </ul>
                    {selectedEvent && (
                        <div className="event-details animated-details">
                            <h2>{selectedEvent.name}</h2>
                            <p>
                                <strong>Date:</strong> {selectedEvent.eventDate}
                            </p>
                            <p>
                                <strong>Location:</strong> {selectedEvent.location}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedEvent.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CategoryEvents;
