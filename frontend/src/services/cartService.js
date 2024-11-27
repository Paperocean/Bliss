const API_URL = 'http://localhost:5000/api/cart';

export const calculateCart = async (cart) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ cart }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to calculate cart.');
        }
        return await response.json();;
    } catch (error) {
        console.error('Error during cart calculation:', error.message);
        throw error;
    }
};
