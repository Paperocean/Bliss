import apiRequest from "../utils/apiRequest";

export const fetchEventByTicket = async (ticket_id) => {
    const data = await apiRequest(`/tickets/${ticket_id}/event`);
    return data.event;
};

export const fetchAvailableSeats = async (eventId) => {
    const data = await apiRequest(`/tickets/available/${eventId}`);
    return data.seats || [];
};

