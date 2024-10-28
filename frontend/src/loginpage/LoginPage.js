import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Import hooka do nawigacji

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Stan do wyświetlania komunikatów
    const navigate = useNavigate(); // Hook do nawigacji

    useEffect(() => {
        console.log('Welcome to the Login Page');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                setMessage('Login successful');
                localStorage.setItem('token', data.token);
                // Store user data in local storage or pass to profile
                localStorage.setItem('user', JSON.stringify(data.user)); // Save user data
                navigate('/profile');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
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
                <button type="submit">Login</button>
                {message && <p>{message}</p>} {/* Wyświetl komunikat o stanie logowania */}
                <p onClick={() => navigate('/register')}>
                    Need an account? Register
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
