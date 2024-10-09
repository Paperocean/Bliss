import React from 'react';

const EventList = () => {
    return (
        <div className="event-list bg-blue-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">LISTA WYDARZEŃ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <a href="https://example.com/event1" className="transform transition-transform hover:scale-105">
                    <img alt="Event 1" className="rounded-lg shadow-md" src="https://placehold.co/200x100?text=Event+1" />
                </a>
                <a href="https://example.com/event2" className="transform transition-transform hover:scale-105">
                    <img alt="Event 2" className="rounded-lg shadow-md" src="https://placehold.co/200x100?text=Event+2" />
                </a>
                <a href="https://example.com/event3" className="transform transition-transform hover:scale-105">
                    <img alt="Event 3" className="rounded-lg shadow-md" src="https://placehold.co/200x100?text=Event+3" />
                </a>
            </div>
        </div>
    );
};

export default EventList;