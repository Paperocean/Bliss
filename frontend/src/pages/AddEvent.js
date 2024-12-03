import React, { useState } from 'react';
import { createEvent } from '../services/eventService';
import useCategories from '../hooks/useCategories';
import useSeatPricing from '../hooks/useSeatPricing';

import SeatGrid from '../components/SeatPricing';
import InputText from '../components/InputText';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

import '../styles/VerticalStack.css';
import '../styles/Select.css';

const AddEvent = () => {
    const { categories, error: categoryError } = useCategories();

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
        <div className="content-section">
            <form onSubmit={handleSubmit} className="form">
                <div className="section">
                    {/* Left Subsection */}
                    <div className="subsection">
                    <div className="form-group">
                        <ErrorMessage message={errorMessage || categoryError} />
                        <InputText
                            label="Event Title"
                            name="title"
                            id="title"
                            placeholder="Enter event title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <InputText
                            label="Description"
                            name="description"
                            id="description"
                            type="textarea"
                            placeholder="Enter event description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5} 
                        />
                        <InputText
                            label="Location"
                            name="location"
                            id="location"
                            placeholder="Enter event location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <InputText
                            label="Start Time"
                            name="start_time"
                            id="start_time"
                            type="datetime-local"
                            placeholder="Select start time"
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                        <InputText
                            label="End Time"
                            name="end_time"
                            id="end_time"
                            type="datetime-local"
                            placeholder="Select end time"
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                        <InputText
                            label="Capacity"
                            name="capacity"
                            id="capacity"
                            type="number"
                            placeholder="Enter event capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                        />
                            <label htmlFor="category_id">Kategoria</label>
                            <select
                                className="select"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Wybierz kategorie</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>
                                Numerowane siedzenia:
                                <input
                                    name="has_numbered_seats"
                                    type="checkbox"
                                    checked={formData.has_numbered_seats}
                                    onChange={handleChange}
                                />
                            </label>
                            {formData.has_numbered_seats && (
                                <>
                                    <InputText
                                        label="Number of Rows"
                                        name="rows"
                                        id="rows"
                                        type="number"
                                        placeholder="Enter number of rows"
                                        value={formData.rows}
                                        onChange={handleChange}
                                    />
                                    <InputText
                                        label="Seats per Row"
                                        name="seats_per_row"
                                        id="seats_per_row"
                                        type="number"
                                        placeholder="Enter seats per row"
                                        value={formData.seats_per_row}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                        </div>
                        <Button type="submit">Create Event</Button>
                    </div>

                    {/* Right Subsection */}
                    <div className="subsection">
                        <SeatGrid
                            rows={formData.rows}
                            seatsPerRow={formData.seats_per_row}
                            seatPrices={seatPrices}
                            handleSeatClick={handleSeatClick}
                            currentSeatPrice={currentSeatPrice}
                            setCurrentSeatPrice={setCurrentSeatPrice}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEvent;
