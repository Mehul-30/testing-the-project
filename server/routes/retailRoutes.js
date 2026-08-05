const express = require("express");

const router = express.Router();

const {

    buyStock,
    getPurchaseHistory

} = require("../controllers/retailController");

router.post("/buy", buyStock);

router.get("/history/:userId", getPurchaseHistory);

module.exports = router;