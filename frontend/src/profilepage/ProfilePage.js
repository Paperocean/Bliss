import React from 'react';
import '../App.css';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Profile Page</h1>
            </header>
            <section className="profile-info">
                <div className="profile-picture">
                    <img src="path/to/profile-picture.jpg" alt="Profile" />
                </div>
                <div className="profile-details">
                    <h2>John Doe</h2>
                    <p>Email: john.doe@example.com</p>
                    <p>Location: New York, USA</p>
                </div>
            </section>
            <section className="profile-posts">
                <h2>Recent Posts</h2>
                <ul>
                    <li>Post 1</li>
                    <li>Post 2</li>
                    <li>Post 3</li>
                </ul>
            </section>
        </div>
    );
};

export default ProfilePage;