const express = require("express");

const router = express.Router();

const {

    getLowStock,
    getNotifications,
    markNotificationRead

} = require("../controllers/managerController");

router.get("/lowstocks", getLowStock);

router.get("/notifications/:id", getNotifications);

router.put("/notifications/:notificationId", markNotificationRead);

module.exports = router;