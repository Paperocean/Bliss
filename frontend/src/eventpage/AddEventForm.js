import React, { useState, useEffect } from 'react';
import { fetchCategories, createEvent } from '../services/eventService';

const AddEventForm = () => {
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
        capacity: '',
        category_id: '',
        rows: '',
        seats_per_row: '',
        has_numbered_seats: false,
        ticket_price: '',
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                if (response.success) {
                    setCategories(response.categories);
                    setErrorMessage('');
                } else {
                    setErrorMessage(response.message);
                }
            } catch (error) {
                console.error(error.message || 'Error fetching categories:', error);
                setErrorMessage('Failed to load categories');
            }
        };

        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.category_id) {
            setErrorMessage('Please select a valid category.');
            return;
        }
    
        try {
            const response = await createEvent(formData);
            if (response.success) {
                console.log('Event created: ', response.event);
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    start_time: '',
                    end_time: '',
                    capacity: '',
                    category_id: '',
                    rows: '',
                    seats_per_row: '',
                    has_numbered_seats: false,
                    ticket_price: '',
                });
            }
        } catch (error) {
            console.error('Error creating event:', error.message);
            setErrorMessage(error.message || 'Failed to create event');
        }
    };
    

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
            <input name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} required />
            <input name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} required />
            <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
            <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <input name="rows" type="number" value={formData.rows} onChange={handleChange} placeholder="Rows" required />
            <input
                name="seats_per_row"
                type="number"
                value={formData.seats_per_row}
                onChange={handleChange}
                placeholder="Seats per Row"
                required
            />
            <label>
                Numbered Seats:
                <input
                    name="has_numbered_seats"
                    type="checkbox"
                    checked={formData.has_numbered_seats}
                    onChange={handleChange}
                />
            </label>
            <input name="ticket_price" type="number" value={formData.ticket_price} onChange={handleChange} placeholder="Ticket Price" required />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default AddEventForm;
