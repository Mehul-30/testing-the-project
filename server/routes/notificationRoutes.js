const express = require("express");

const router = express.Router();

const {

    getNotifications,
    markRead

} = require("../controllers/notificationController");

router.get("/:id", getNotifications);

router.put("/:id", markRead);

module.exports = router;