const express = require("express");

const router = express.Router();

const {

    register,
    login,
    getNotifications,
    markNotificationRead

} = require("../controllers/userController");

router.post("/register", register);

router.post("/login", login);

router.get("/notifications/:id", getNotifications);

router.put("/notifications/:notificationId", markNotificationRead);

module.exports = router;

