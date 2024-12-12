import apiRequest from '../utils/apiRequest';

export const loginUserRequest = async (credentials) => {
  return apiRequest('/auth/login', 'POST', credentials);
};

export const registerUserRequest = async (userData) => {
  return apiRequest('/auth/register', 'POST', userData);
};
