import apiRequest from '../utils/apiRequest';

export const getEventByTicketRequest = async (ticket_id) => {
  const data = await apiRequest(`/tickets/${ticket_id}/event`);
  return data.event;
};

export const getAvailableSeatsRequest = async (eventId) => {
  const data = await apiRequest(`/tickets/available/${eventId}`);
  return data.seats || [];
};

export const refundTicketRequest = async (ticket_id) => {
  return await apiRequest(`/tickets/${ticket_id}/refund`, 'POST');
};