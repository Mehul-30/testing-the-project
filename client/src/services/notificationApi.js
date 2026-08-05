import api from "./api";

export const getNotifications = (userId) => {

    return api.get(`/notifications/${userId}`);

};

export const markRead = (notificationId) => {

    return api.put(`/notifications/${notificationId}`);

};