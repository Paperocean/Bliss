import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        location: '',
        event_date: '',
        category: '',
    }); // State for the new event form
    const [events, setEvents] = useState([]); // List of user's events
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Get user data
        if (user) {
            setUserData(user);
            // Optionally, load user events from an API or localStorage
            const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
            setEvents(savedEvents);
        } else {
            setErrorMessage('User not found. Please log in.');
            navigate('/login');
        }
    }, [navigate]);

    // Handle input changes for new event form
    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submitting a new event
    const handleSubmitEvent = async (e) => {
        e.preventDefault();

        if (newEvent.name && newEvent.event_date) {
            try {
                // Sending data to API to create the event
                const response = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEvent),
                });

                const data = await response.json();

                if (data.success) {
                    setEvents((prevEvents) => [...prevEvents, data.event]); // Update the event list
                    localStorage.setItem('events', JSON.stringify([...events, data.event])); // Save to localStorage
                    setNewEvent({ name: '', description: '', location: '', event_date: '' }); // Reset form
                } else {
                    setErrorMessage('Failed to create event: ' + data.message);
                }
            } catch (error) {
                setErrorMessage('Error creating event: ' + error.message);
            }
        } else {
            setErrorMessage('Both name and event date are required.');
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

            <Link to="/" className="home-button">
                    Go Home
            </Link>

            {/* Form for creating a new event */}
            <section className="add-event-section">
                <h3>Create New Event</h3>
                <form onSubmit={handleSubmitEvent}>
                    <div>
                        <label htmlFor="name">Event Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newEvent.name}
                            onChange={handleEventInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newEvent.description}
                            onChange={handleEventInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={newEvent.location}
                            onChange={handleEventInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="event_date">Event Date:</label>
                        <input
                            type="date"
                            id="event_date"
                            name="event_date"
                            value={newEvent.event_date}
                            onChange={handleEventInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={newEvent.category}
                            onChange={handleEventInputChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Rock">Rock</option>
                            <option value="Pop">Pop</option>
                            <option value="Party">Party</option>
                            <option value="Hip-Hop">Hip-Hop</option>
                            <option value="Rap">Rap</option>
                            <option value="Jazz">Jazz</option>
                        </select>
                    </div>
                    <button type="submit">Create Event</button>
                </form>
            </section>

            {/* Display the list of events */}
            <section className="events-list">
                <h3>Your Events</h3>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>
                                <strong>{event.name}</strong> - {event.event_date} <br />
                                {event.description && <span>{event.description}</span>}
                                <p>{event.location}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events created yet.</p>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;
