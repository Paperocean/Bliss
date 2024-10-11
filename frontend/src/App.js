import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './homepage/Homepage';
import EventPage from './eventpage/Eventpage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/cart" element={<EventPage />} />
        <Route path="/profile" element={<EventPage />} />
        <Route path="/login" element={<EventPage />} />
      </Routes>
    </Router>
  );
};

export default App;