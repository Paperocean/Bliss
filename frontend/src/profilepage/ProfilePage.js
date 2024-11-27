import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; 
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext); 
    const [errorMessage, setErrorMessage] = useState('');
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
        capacity: '',
        category: '',
    });
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events/categories');
                const data = await response.json();
                if (data.success) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            setErrorMessage('You must be logged in to create an event.');
            return;
        }

        if (newEvent.name && newEvent.start_time && newEvent.end_time && newEvent.capacity) {
            try {
                const response = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(newEvent),
                });

                const data = await response.json();
                if (data.success) {
                    const updatedEvents = [...events, data.event];
                    setEvents(updatedEvents);
                    setNewEvent({
                        name: '',
                        description: '',
                        location: '',
                        start_time: '',
                        end_time: '',
                        capacity: '',
                        category: '',
                    });
                } else {
                    setErrorMessage(`Failed to create event: ${data.message}`);
                }
            } catch (error) {
                setErrorMessage(`Error creating event: ${error.message}`);
            }
        } else {
            setErrorMessage('All fields are required.');
        }
    };

    const handleAddToCart = (event) => {
        const cartItem = {
            id: event.event_id,
            name: event.title,
            price: 50,
        };
        addToCart(cartItem, 1);
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

            {user ? (
                <section className="profile-info">
                    <h2>{user.username}</h2>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
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
                        <label htmlFor="start_time">Start Time</label>
                        <input
                            type="datetime-local"
                            id="start_time"
                            name="start_time"
                            value={newEvent.start_time}
                            onChange={handleEventInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end_time">End Time</label>
                        <input
                            type="datetime-local"
                            id="end_time"
                            name="end_time"
                            value={newEvent.end_time}
                            onChange={handleEventInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="capacity">Capacity</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={newEvent.capacity}
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
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
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
                        {events.map((event) => (
                            <li key={event.event_id}>
                                <strong>{event.title}</strong> - {event.start_time} <br />
                                {event.description && <span>{event.description}</span>}
                                <p>{event.location}</p>
                                <p>Capacity: {event.capacity}</p>
                                <button onClick={() => handleAddToCart(event)}>Add to Cart</button>
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
