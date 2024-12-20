import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Layout from './Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const AddEvent = lazy(() => import('./pages/AddEvent/AddEvent'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Event = lazy(() => import('./pages/Event/Event'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div>Ładowanie...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add-event" element={<AddEvent />} />
                <Route path="/event" element={<Event />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
