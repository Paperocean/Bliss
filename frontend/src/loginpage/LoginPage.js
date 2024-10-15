import React, { useState } from 'react';
import '../App.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // nowy stan dla imienia
    const [isRegister, setIsRegister] = useState(false); // toggle between login and register

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        console.log("Form submitted"); // Dodaj ten log
        const endpoint = isRegister ? '/register' : '/login';

        try {
            const response = await fetch(`https://bliss-instance-1.chsq4e0qk2i3.eu-north-1.rds.amazonaws.com/prod${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    ...(isRegister && { name })
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
                {isRegister && ( // pokaż pole name tylko podczas rejestracji
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
            </form>
        </div>
    );
};

export default LoginPage;