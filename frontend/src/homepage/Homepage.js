import React from 'react';
import './Homepage.css'
import Header from './Header';
import EventList from './EventList';
import Footer from './Footer';

const Homepage = () => {
  return (
      <div className="container">
        <Header />
        <EventList />
        <Footer />
      </div>
  );
};

export default Homepage;