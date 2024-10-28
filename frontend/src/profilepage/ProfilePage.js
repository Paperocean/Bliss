import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Get user data
        if (user) {
            setUserData(user);
        } else {
            setErrorMessage('User not found. Please log in.');
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Profile Page</h1>
            </header>
            <section className="profile-info">
                {errorMessage && <p>{errorMessage}</p>}
                {userData ? (
                    <div className="profile-details">
                        <h2>{userData.username}</h2>
                        <p>Email: {userData.email}</p>
                        <p>Password: {userData.password_hash}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;
