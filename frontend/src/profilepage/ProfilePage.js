import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfilePage.css'; // Import a custom CSS file for styling

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        location: '',
        event_date: '',
        category: '',
    });
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserData(user);
            const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
            setEvents(savedEvents);
        } else {
            setErrorMessage('User not found. Please log in.');
            navigate('/login');
        }
    }, [navigate]);

    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        if (newEvent.name && newEvent.event_date) {
            try {
                const response = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEvent),
                });

                const data = await response.json();
                if (data.success) {
                    const updatedEvents = [...events, data.event];
                    setEvents(updatedEvents);
                    localStorage.setItem('events', JSON.stringify(updatedEvents));
                    setNewEvent({
                        name: '',
                        description: '',
                        location: '',
                        event_date: '',
                        category: '',
                    });
                } else {
                    setErrorMessage(`Failed to create event: ${data.message}`);
                }
            } catch (error) {
                setErrorMessage(`Error creating event: ${error.message}`);
            }
        } else {
            setErrorMessage('Event name and date are required.');
        }
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Welcome to Your Profile</h1>
                <Link to="/" className="btn btn-primary">
                    Go Home
                </Link>
            </header>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {userData ? (
                <section className="profile-info">
                    <h2>{userData.username}</h2>
                    <p><strong>Email:</strong> {userData.email}</p>
                </section>
            ) : (
                <p>Loading user data...</p>
            )}

            <section className="add-event-section">
                <h3>Create a New Event</h3>
                <form className="event-form" onSubmit={handleSubmitEvent}>
                    <div className="form-group">
                        <label htmlFor="name">Event Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newEvent.name}
                            onChange={handleEventInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newEvent.description}
                            onChange={handleEventInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={newEvent.location}
                            onChange={handleEventInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="event_date">Event Date</label>
                        <input
                            type="date"
                            id="event_date"
                            name="event_date"
                            value={newEvent.event_date}
                            onChange={handleEventInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={newEvent.category}
                            onChange={handleEventInputChange}
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
                    <button type="submit" className="btn btn-success">
                        Create Event
                    </button>
                </form>
            </section>

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
