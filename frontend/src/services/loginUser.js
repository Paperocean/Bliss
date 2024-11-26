const API_URL = 'http://localhost:5000';

export const loginUser = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during user login:', error.message);
        throw new Error(error.message || 'Server error occurred during login');
    }
};
