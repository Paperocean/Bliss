import './App.css';
import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import EventList from './EventList';
import Footer from './Footer';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <SearchBar />
      <EventList />
      <Footer />
    </div>
  );
};

export default App;
