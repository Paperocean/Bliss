import React from 'react';
import './Homepage.css'
import Header from './Header';
import SearchBar from './SearchBar';
import EventList from './EventList';
import Footer from './Footer';

const Homepage = () => {
  return (
      <div className="container">
        <Header />
        <SearchBar />
        <EventList />
        <Footer />
      </div>
  );
};

export default Homepage;