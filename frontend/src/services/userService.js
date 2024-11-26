const API_URL = 'http://localhost:5000';

const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.user; 
};

export default fetchProfile;
