import apiRequest from "../utils/apiRequest";

export const createEvent = async (eventData) => {
    return apiRequest('/events', 'POST', eventData);
};

export const fetchEvents = async () => {
    return apiRequest('/events');
};

export const fetchCategories = async () => {
    return apiRequest('/events/categories');
};

export const fetchEventsByCategory = async (category) => {
    return apiRequest(`/events/category/${category}`);
}