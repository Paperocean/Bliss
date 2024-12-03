import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home'; 
import Login from './pages/Login'; 
import Register from './pages/Register';
import Layout from './components/Layout';

import EventTestView from './pages/eventpage/EventTestView';
import CartPage from './pages/cartpage/CartPage';

import ProfilePage from './pages/profilepage/ProfilePage';
import AddEvent from './pages/AddEvent';
import ProtectedRoute from './components/ProtectedRoute';

import './styles/App.css'; 

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/test-event" element={<EventTestView />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
