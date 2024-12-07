import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import HomePage from './pages/homepage/Homepage';
import EventPage from './pages/eventpage/Eventpage';
import EventTestView from './pages/eventpage/EventTestView';
import CategoryEvents from './pages/eventpage/CategoryEvents';
import CartPage from './pages/cartpage/CartPage';
import ProfilePage from './pages/profilepage/ProfilePage';
import LoginPage from './pages/loginpage/LoginPage';
import RegisterPage from './pages/registerpage/RegisterPage';
import AddEventForm from './pages/eventpage/AddEventForm';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentForm from './pages/cartpage/PaymentForm';

const App = () => {
  return (
    <CartProvider>
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
            <Route path="/payment" element={<PaymentForm />} />
          </Routes>
        </Router>
      </div>
    </CartProvider>
  );
};

export default App;
