import React, { useState } from 'react';

const EventForm = ({ onCreate }) => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventCategory, setEventCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (eventName && eventDate && eventCategory) {
            onCreate({ name: eventName, date: eventDate, category: eventCategory });
            setEventName('');
            setEventDate('');
            setEventCategory('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <h2>Create New Event</h2>
            <input
                type="text"
                placeholder="Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                style={{ width: '100px' }}
            />
            <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                style={{ width: '100px' }}
            />
            <input
                type="text"
                placeholder="Category"
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                required
                style={{ width: '80px' }}
            />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default EventForm;
