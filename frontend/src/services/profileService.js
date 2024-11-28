import apiRequest from "../utils/apiRequest";

export const fetchProfile = async () => {
    const data = await apiRequest('/user/profile', 'GET', null, true);
    return data.user;
};

