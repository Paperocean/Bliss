import apiRequest from '../utils/apiRequest';

export const createEventRequest = async (eventData) => {
  return apiRequest('/events', 'POST', eventData, true);
};

export const getEventsRequest = async () => {
  return apiRequest('/events');
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
