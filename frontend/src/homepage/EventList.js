import React from 'react';
import img1 from '../images/img1.jpg'; // Zaktualizuj ścieżki, aby odpowiadały lokalizacji obrazów
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';

const EventList = () => {
    return (
        <div className="event-list-container">
            <h1 className='event-list-title'>POPULARNE KATEGORIE</h1>
            <div className="event-list">
                <a href="https://example.com/event1" className="transform transition-transform hover:scale-105">
                    <img alt="Event 1" className="rounded-lg shadow-md" src={img1} />
                    <p className="event-caption">ROCK</p> {/* Dodano napis */}
                </a>
                <a href="https://example.com/event2" className="transform transition-transform hover:scale-105">
                    <img alt="Event 2" className="rounded-lg shadow-md" src={img2} />
                    <p className="event-caption">IMPREZA</p> {/* Dodano napis */}
                </a>
                <a href="https://example.com/event3" className="transform transition-transform hover:scale-105">
                    <img alt="Event 3" className="rounded-lg shadow-md" src={img3} />
                    <p className="event-caption">POP</p> {/* Dodano napis */}
                </a>
            </div>
        </div>
    );
};

export default EventList;