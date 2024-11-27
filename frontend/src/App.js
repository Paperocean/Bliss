import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import HomePage from './homepage/Homepage';
import EventPage from './eventpage/Eventpage';
import EventTestView from './eventpage/EventTestView';
import CategoryEvents from './eventpage/CategoryEvents';
import CartPage from './cartpage/CartPage';
import ProfilePage from './profilepage/ProfilePage';
import LoginPage from './loginpage/LoginPage';
import RegisterPage from './registerpage/RegisterPage';
import AddEventForm  from './eventpage/AddEventForm';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <CartProvider> { }
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/event-test" element={<EventTestView />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events/:category" element={<CategoryEvents />} />
          <Route path="/add-event" element={<AddEventForm />} />
        </Routes>
      </Router>
    </div>
    </CartProvider>
  );
};

export default App;