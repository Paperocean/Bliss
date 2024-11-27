const API_URL = 'http://localhost:5000/api/events';

export const createEvent = async (eventData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message ||'Failed to create event');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating event:', error.message);
        throw error;
    }
};

export const fetchEvents = async () => {
    try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch events');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching events: ', error.message);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories: ', error.message);
        throw error;
    }
};
