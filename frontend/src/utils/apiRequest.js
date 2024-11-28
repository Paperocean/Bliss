const BASE_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, method = 'GET', data = null, authRequired = false) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json' };

        if (authRequired) {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated. Token is missing.');
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error during API request (${method} ${endpoint}):`, error.message);
        throw error;
    }
};

export default apiRequest;
