import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Import hooka do nawigacji

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate(); // Hook do nawigacji

    useEffect(() => {
        console.log('Welcome to the Login Page');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
    
        // Ustal endpoint na podstawie trybu rejestracji
        const endpoint = isRegister ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
    
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    ...(isRegister && { username })
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                console.log(isRegister ? 'Registration successful' : 'Login successful');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>{isRegister ? 'Register' : 'Login'}</h2>
                {isRegister && (
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
                )}
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
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                <p onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Already have an account? Log in' : 'Need an account? Register'}
                </p>
                {!isRegister && (
                    <button type="button" onClick={() => navigate('/register')}>
                        Go to Registration
                    </button>
                )}
            </form>
        </div>
    );
};

export default LoginPage;
