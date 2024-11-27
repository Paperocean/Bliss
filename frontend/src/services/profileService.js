const API_URL = 'http://localhost:5000/api/user';

const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch profile');
        }
        return response.user; 
    } catch (error) {
        console.error('Error fetching profile: ', error.message);
        throw error;
    }
};

export default fetchProfile;
