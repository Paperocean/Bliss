import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import './LoginPage.css';

import Header from '../homepage/Header';
import Footer from '../homepage/Footer';
import { loginUser } from '../services/loginUser';

const LoginPage = () => {
    const { isLoggedIn, login } = useContext(AuthContext);
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
        
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }
    
        try {
            const response = await loginUser({ email, password});
                if (response.success) {
                    login(response.token, response.user);
                    setMessage('User logged in successfully');
                    navigate('/');
                } else {
                    setMessage(response.message);
                }
        } catch (error) {
            console.error('Registration error: ', error);
            setMessage('Logging in failed. Please try again.');
        }
    };

    return (
        <div className='login-page'>
            <Header />
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
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Zaloguj</button>
                {message && <p>{message}</p>} {/* Wyświetl komunikat o stanie logowania */}
                <p onClick={() => navigate('/register')}>
                    Nie posiadasz konta? Zarejestruj się
                </p>
            </form>
            <Footer />
        </div>
    );
};

export default LoginPage;
