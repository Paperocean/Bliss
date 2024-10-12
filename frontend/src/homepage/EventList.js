import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import img1 from '../images/img1.jpg'; 
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';

const events = [
    { category: 'rock', img: img1, caption: 'ROCK' },
    { category: 'party', img: img2, caption: 'PARTY' },
    { category: 'pop', img: img3, caption: 'POP' }
];

const EventList = () => {
    const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event

    const handleEventClick = (category) => {
        setSelectedEvent(category); // Set the selected event category
    };

    return (
        <div className="event-list-container">
            <h1 className='event-list-title'>POPULARNE KATEGORIE</h1>
            <div className="event-list">
                {events.map(event => (
                    <Link 
                        key={event.category} 
                        to={`/events/${event.category}`} 
                        className={`transform transition-transform hover:scale-105 event ${selectedEvent === event.category ? 'selected' : ''}`} // Add selected class if it's the active event
                        onClick={() => handleEventClick(event.category)} // Handle click to set selected event
                    >
                        <img 
                            alt={`Event ${event.caption}`} 
                            className="rounded-lg shadow-md" 
                            src={event.img} 
                        />
                        <p className="event-caption">{event.caption}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EventList;
