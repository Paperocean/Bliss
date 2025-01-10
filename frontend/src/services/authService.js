import apiRequest from '../utils/apiRequest';

export const loginUserRequest = async (credentials) => {
  try {
    return await apiRequest('/auth/login', 'POST', credentials);
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: error.message };
  }
};

export const registerUserRequest = async (userData) => {
  try {
    return await apiRequest('/auth/register', 'POST', userData);
  } catch (error){
    console.error('Error registering:', error);
    return { success: false, message: error.message };
  }
};
