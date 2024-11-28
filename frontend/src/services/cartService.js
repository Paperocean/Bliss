import apiRequest from "../utils/apiRequest";

export const calculateCart = async (cart) => {
    return apiRequest('cart/checkout', 'POST', { cart }, true);
};