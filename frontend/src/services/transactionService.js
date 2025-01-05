import apiRequest from '../utils/apiRequest';

export const purchaseRequest = async (cart) => {
  const response = await apiRequest('/transaction/purchase', 'POST', { cart }, true);
  
  if (response.success) {
    return {
      transactionId: response.transaction.transaction_id,
      totalAmount: response.transaction.total_amount,
      tickets: response.transaction.tickets,
    };
  } else {
    throw new Error(response.message || 'Błąd podczas zakupu biletów.');
  }
};