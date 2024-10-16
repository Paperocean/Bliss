import React, { useState } from 'react';
import '../App.css';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';
import EventCategories from './EventCategories';
import { Route, Routes } from 'react-router-dom';
import CategoryEvents from './CategoryEvents';
import EventForm from './EventForm'; // Import the EventForm component

const EventPage = () => {
    const [events, setEvents] = useState([]); // State to hold created events

    const handleCreateEvent = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    return (
        <div className="app">
            <div className="container">
                <Header />
                <main className="event-main">
                    <section className="event-categories">
                        <h2 className="animated-title">Event Categories</h2>
                        <EventCategories />
                    </section>
                    <section className="category-events">
                        <EventForm onCreate={handleCreateEvent} />
                        <Routes>
                            <Route path="/events/:category" element={<CategoryEvents events={events} />} />
                        </Routes>
                    </section>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default EventPage;