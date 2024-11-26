import React, { useState } from 'react';
import '../loginpage/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import Header from '../homepage/Header';
import Footer from '../homepage/Footer';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage('User registered successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Registration failed. Please try again.');
        }
    };

    const handleLogin = () => {
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
                    <button onClick={handleLogin} className="login-button">
                        Login
                    </button>
                )}
            </form>
            <Footer />
        </div>
    );
};

export default RegisterPage;
