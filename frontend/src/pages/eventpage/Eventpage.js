import React from 'react';
import './Eventpage.css';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';
import EventCategories from './EventCategories';
import { Route, Routes } from 'react-router-dom';
import CategoryEvents from './CategoryEvents';

const EventPage = () => {
    return (
        <div className="container">
            <Header />
            <main className="event-main">
                <section className="event-categories">
                    <h2 className="animated-title">Event Categories</h2>
                    <EventCategories />
                </section>
                <section className="category-events">
                    <Routes>
                        <Route path="/events/:category" element={<CategoryEvents />} />
                    </Routes>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default EventPage;
