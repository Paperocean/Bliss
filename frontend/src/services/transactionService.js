import apiRequest from '../utils/apiRequest';

export const purchase = async (cart) => {
  return apiRequest('/transaction/purchase', 'POST', { cart }, true);
};
