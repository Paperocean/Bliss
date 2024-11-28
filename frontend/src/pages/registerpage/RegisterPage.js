import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';

import '../loginpage/LoginPage.css';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';

const RegisterPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await registerUser({ username, email, password });
            if (response.success) {
                setMessage('User registered successfully');
            } else {
                setMessage(response.message);
            }
        } catch (error) {
            console.error('Registration error: ', error);
            setMessage('Registration failed. Please try again.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="login-page">
            <Header />
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                {message && <p>{message}</p>}
                {message === 'User registered successfully' && (
                    <button
                        onClick={handleLoginRedirect}
                        type="button"
                        className="login-button"
                    >
                        Go to Login
                    </button>
                )}
            </form>
            <Footer />
        </div>
    );
};

export default RegisterPage;
