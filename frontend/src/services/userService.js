import apiRequest from 'utils/apiRequest';

export const getProfileRequest = async () => {
  return await apiRequest('/user/profile', 'GET', null, true);
};

export const getUsersTicketsRequest = async () => {
  return await apiRequest('/user/tickets', 'GET', null, true);
};

export const changePasswordRequest = async (currentPassword, newPassword) => {
  return await apiRequest(
    '/user/change-password',
    'PUT',
    { currentPassword, newPassword },
    true
  );
};
