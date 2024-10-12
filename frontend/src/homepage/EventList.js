import React from 'react';
import { Link } from 'react-router-dom'; // Importuj Link do nawigacji
import img1 from '../images/img1.jpg'; // Zaktualizuj ścieżki, aby odpowiadały lokalizacji obrazów
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';

const events = [
    { category: 'rock', img: img1, caption: 'ROCK' },
    { category: 'party', img: img2, caption: 'PARTY' },
    { category: 'pop', img: img3, caption: 'POP' }
];

const EventList = () => {
    return (
        <div className="event-list-container">
            <h1 className='event-list-title'>POPULARNE KATEGORIE</h1>
            <div className="event-list">
                {events.map(event => (
                    <Link 
                        key={event.category} 
                        to={`/events/${event.category}`} // Zaktualizowano, aby używać event.category
                        className="transform transition-transform hover:scale-105"
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
