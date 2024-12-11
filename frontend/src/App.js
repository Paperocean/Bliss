import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Layout from './Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AddEvent = lazy(() => import('./pages/AddEvent'));
const Cart = lazy(() => import('./pages/Cart'));
const EventTestView = lazy(() => import('./pages/eventpage/EventTestView'));
const ProfilePage = lazy(() => import('./pages/profilepage/ProfilePage'));
const Profile = lazy(() => import('./pages/Profile'));

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
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
                <Route path="/test-event" element={<EventTestView />} />
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
