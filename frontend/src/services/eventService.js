import apiRequest from '../utils/apiRequest';

export const createEventRequest = async (eventData) => {
  return apiRequest('/events', 'POST', eventData, true);
};

export const getEventRequest = async (eventId) => {
  return apiRequest(`/events/get/${eventId}`);
};

export const getEventsRequest = async (
  page = 1,
  limit = 10,
  search = '',
  category = ''
) => {
  return apiRequest(
    `/events?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&category=${encodeURIComponent(category)}`
  );
};

export const getCategoriesRequest = async () => {
  return apiRequest('/events/categories');
};

export const getEventsByCategoryRequest = async (category) => {
  return apiRequest(`/events/category/${category}`);
};

export const getOrganizerEventsRequest = async (organizerId) => {
  return apiRequest(`/events/${organizerId}`, 'GET', null, true);
};

// Edycja wydarzenia
export const editEvent = async (eventId, updatedData) => {
  return await apiRequest(`/events/edit/${eventId}`, 'PUT', updatedData, true);
};

// Generowanie raportu
export const getEventReport = async (eventId) => {
  return await apiRequest(`/events/report/${eventId}`, 'GET', null, true);
};

// Aktualizacja szczegółów eventu
export const updateEvent = async (eventId, updateData) => {
  return await apiRequest(`/events/update/${eventId}`, 'PUT', updateData, true);
};

export const buyTicketRequest = async (payload) => {
  // {
  //   event_id: ...,
  //   selected_seats: ['A1', 'A2'] // dla numerowanych
  //   quantity: 2 // dla nienumerowanych
  // }
  return await apiRequest(`/api/events/${payload.event_id}/buy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

export const deleteEventRequest = async (eventId) => {
  return await apiRequest(`/events/${eventId}/delete`, 'POST', null, true);
};

export const fetchEventStatus = async (eventId) => {
  try {
    const response = await apiRequest(`/events/status/${eventId}`, 'GET', null, true);
    return response?.status === 'cancelled';
  } catch (error) {
    console.error('Błąd pobierania statusu wydarzenia:', error);
    return false; 
  }
};