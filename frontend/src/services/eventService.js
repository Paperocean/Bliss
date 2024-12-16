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
