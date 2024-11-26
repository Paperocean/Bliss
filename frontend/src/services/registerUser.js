const API_URL = 'http://localhost:5000';

export const registerUser = async ({ username, email, password }) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error during user registration', error);
        throw new Error('Server error occured during registration');
    }
};