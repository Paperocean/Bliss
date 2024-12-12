import apiRequest from '../utils/apiRequest';

export const calculateCartRequest = async (cart) => {
  return apiRequest('/cart/calculate', 'POST', { cart }, true);
};
