import apiRequest from '../utils/apiRequest';

export const loginUser = async (credentials) => {
    return apiRequest('/auth/login', 'POST', credentials);
};

export const registerUser = async (userData) => {
    return apiRequest('/auth/register', 'POST', userData);
};
