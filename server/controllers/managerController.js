const db = require("../database/connectDatabase");

// Get all low-stock items
const getLowStock = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT
                l.alert_id,
                s.stock_id,
                s.stock_name,
                c.category_name,
                l.current_quantity,
                l.created_at

            FROM less_count_stocks l

            JOIN stocks s
            ON l.stock_id = s.stock_id

            JOIN categories c
            ON s.category_id = c.category_id

            ORDER BY l.created_at DESC`

        );

        res.status(200).json(rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

};


// Get notifications for a manager
const getNotifications = async (req, res) => {

    try {

        const managerId = req.params.id;

        const [rows] = await db.query(

            `SELECT
                notification_id,
                title,
                message,
                type,
                is_read,
                created_at

            FROM notifications

            WHERE user_id=?

            ORDER BY created_at DESC`,

            [managerId]

        );

        res.status(200).json(rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

};


// Mark notification as read
const markNotificationRead = async (req, res) => {

    try {

        await db.query(

            `UPDATE notifications
             SET is_read = true
             WHERE notification_id=?`,

            [req.params.notificationId]

        );

        res.status(200).json({

            message: "Notification Updated"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

};


module.exports = {

    getLowStock,
    getNotifications,
    markNotificationRead

};