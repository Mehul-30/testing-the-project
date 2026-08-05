import api from "./api";

export const addStock = (data) => {

    return api.post("/stocks/add", data);

};

export const getPendingStocks = () => {

    return api.get("/stocks/pending");

};

export const importStocks = () => {

    return api.post("/stocks/import");

};

export const getLowStocks = () => {

    return api.get("/manager/lowstocks");

};