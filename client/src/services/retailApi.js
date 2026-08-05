import api from "./api";

export const buyStock = (data) => {

    return api.post("/retail/buy", data);

};

export const getPurchaseHistory = (userId) => {

    return api.get(`/retail/history/${userId}`);

};