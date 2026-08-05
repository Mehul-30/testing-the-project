const express = require("express");

const router = express.Router();

const {

    addStock,
    importStocks,
    getNewStocks,
    getAllStocks,
    getStock

} = require("../controllers/stockController");

// Manager adds stock to temporary table
router.post("/add", addStock);

// Manager imports temporary stock to main stock table
router.post("/import", importStocks);

// View temporary stock table
router.get("/pending", getNewStocks);

// View all available stocks
router.get("/", getAllStocks);

// View a particular stock
router.get("/:id", getStock);

module.exports = router;