import apiRequest from '../utils/apiRequest';

export const calculateCart = async (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error('Invalid cart. The cart must be a non-empty array.');
  }

  return apiRequest('/cart/calculate', 'POST', { cart }, true);
};
