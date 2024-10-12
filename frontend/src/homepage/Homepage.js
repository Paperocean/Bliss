import React from 'react';
import '../App.css';
import Header from './Header';
import SearchBar from './SearchBar';
import EventList from './EventList';
import Footer from './Footer';

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="container">
        <Header />
        <SearchBar />
        <EventList />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;