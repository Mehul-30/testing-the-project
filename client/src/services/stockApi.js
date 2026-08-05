import api from "./api";

export const getAllStocks = () => {

    return api.get("/stocks");

};

export const getStock = (id) => {

    return api.get(`/stocks/${id}`);

};