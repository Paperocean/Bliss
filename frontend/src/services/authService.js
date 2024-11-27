const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async ({ email, password }) => {
  try {
    console.log('Attempting login for user:', email);
    const response = await fetch(`${API_URL}/login`, {
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
    return await response.json();;
  } catch (error) {
    console.error('Error logging user:', error.message);
    throw error;
  }
};

export const registerUser = async ({ username, email, password }) => {
    try {
        console.log('Registering user:', { username, email });

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during user registration:', error.message);
        throw error;
    }
};
