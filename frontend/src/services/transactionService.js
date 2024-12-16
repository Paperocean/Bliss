import apiRequest from '../utils/apiRequest';

export const purchaseRequest = async (cart) => {
  return apiRequest('/transaction/purchase', 'POST', { cart }, true);
};
