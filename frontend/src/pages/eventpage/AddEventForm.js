import React, { useState } from 'react';
import { createEvent } from '../../services/eventService';
import useCategories from '../../hooks/useCategories';
import ErrorMessage from '../../components/ErrorMessage';
import useSeatPricing from '../../hooks/useSeatPricing';

import SeatGrid from '../../components/SeatPricing';

const AddEventForm = () => {
    const { categories, error: categoryError } = useCategories();
    const [showSeatGrid, setShowSeatGrid] = useState(false);

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
    });

    const {
        seatPrices,
        currentSeatPrice,
        errorMessage,
        setCurrentSeatPrice,
        handleSeatClick,
        resetSeatPricing,
        setErrorMessage,
    } = useSeatPricing();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'has_numbered_seats' && !checked) {
            setShowSeatGrid(false);
            resetSeatPricing();
        }
    };

    const handleGenerateGrid = () => {
        if (formData.rows && formData.seats_per_row) {
            setShowSeatGrid(true);
        } else {
            setErrorMessage('Please provide both number of rows and seats per row.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category_id) {
            setErrorMessage('Please select a valid category.');
            return;
        }

        if (Object.keys(seatPrices).length === 0) {
            setErrorMessage('Please set prices for all seats.');
            return;
        }

        try {
            const response = await createEvent({
                ...formData,
                seat_prices: seatPrices,
            });
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
                });
                resetSeatPricing();
            }
        } catch (error) {
            console.error('Error creating event:', error.message);
            setErrorMessage(error.message || 'Failed to create event');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <ErrorMessage message={errorMessage || categoryError} />
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
            <label>
                Numbered Seats:
                <input
                    name="has_numbered_seats"
                    type="checkbox"
                    checked={formData.has_numbered_seats}
                    onChange={handleChange}
                />
            </label>
            {formData.has_numbered_seats && (
                <>
                    <input
                        name="rows"
                        type="number"
                        value={formData.rows}
                        onChange={handleChange}
                        placeholder="Number of Rows"
                        required
                    />
                    <input
                        name="seats_per_row"
                        type="number"
                        value={formData.seats_per_row}
                        onChange={handleChange}
                        placeholder="Seats per Row"
                        required
                    />
                    <button type="button" onClick={handleGenerateGrid}>
                        Generate Seat Grid
                    </button>
                </>
            )}
            {showSeatGrid && (
                <SeatGrid
                    rows={formData.rows}
                    seatsPerRow={formData.seats_per_row}
                    seatPrices={seatPrices}
                    handleSeatClick={handleSeatClick}
                    currentSeatPrice={currentSeatPrice}
                    setCurrentSeatPrice={setCurrentSeatPrice} 
                />
            )}
            <button type="submit">Create Event</button>
        </form>
    );
};

export default AddEventForm;
