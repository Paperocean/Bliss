import apiRequest from 'utils/apiRequest';

export const getProfileRequest = async () => {
  try {
    return await apiRequest('/user/profile', 'GET', null, true);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, message: error.message };
  }
};

export const getUsersTicketsRequest = async () => {
  try {
    return await apiRequest('/user/tickets', 'GET', null, true);
  }
  catch (error) {
    console.error('Error getting user tickets:', error);
    return { success: false, message: error.message };
  }
};

export const changePasswordRequest = async (currentPassword, newPassword) => {
  try {
    return await apiRequest('/user/password', 'POST', {
      currentPassword,
      newPassword,
    }, true);
  }
  catch (error) {
    console.error('Error changing password:', error);
    return { success: false, message: error.message };
  }
};