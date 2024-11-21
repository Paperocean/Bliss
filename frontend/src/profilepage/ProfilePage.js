import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [songs, setSongs] = useState([]); // To store the user's songs
    const [newSong, setNewSong] = useState({ title: '', artist: '' }); // To track input fields for a new song
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Get user data
        if (user) {
            setUserData(user);
            // Optionally, load user songs from an API or local storage
            const savedSongs = JSON.parse(localStorage.getItem('songs')) || []; // For now, use localStorage
            setSongs(savedSongs);
        } else {
            setErrorMessage('User not found. Please log in.');
            navigate('/login');
        }
    }, [navigate]);

    // Handle the change in the song input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSong((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submitting a new song
    const handleSubmitSong = (e) => {
        e.preventDefault();
        if (newSong.title && newSong.artist) {
            // Add the new song to the list
            const updatedSongs = [...songs, newSong];
            setSongs(updatedSongs);
            // Save the updated songs list to localStorage
            localStorage.setItem('songs', JSON.stringify(updatedSongs));
            setNewSong({ title: '', artist: '' }); // Reset the form
        } else {
            setErrorMessage('Both title and artist are required.');
        }
    };

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

            {/* Form for adding a song */}
            <section className="add-song-section">
                <h3>Add a Song</h3>
                <form onSubmit={handleSubmitSong}>
                    <div>
                        <label htmlFor="title">Song Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newSong.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="artist">Artist:</label>
                        <input
                            type="text"
                            id="artist"
                            name="artist"
                            value={newSong.artist}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">Add Song</button>
                </form>
            </section>

            {/* Display the list of songs */}
            <section className="songs-list">
                <h3>Your Songs</h3>
                {songs.length > 0 ? (
                    <ul>
                        {songs.map((song, index) => (
                            <li key={index}>
                                <strong>{song.title}</strong> by {song.artist}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No songs added yet.</p>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;
