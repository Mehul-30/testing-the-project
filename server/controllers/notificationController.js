const db = require("../database/connectDatabase");

// Get all notifications of a user
const getNotifications = async (req, res) => {

    try {

        const userId = req.params.id;

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

            [userId]

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
const markRead = async (req, res) => {

    try {

        const notificationId = req.params.id;

        const [result] = await db.query(

            `UPDATE notifications
             SET is_read = true
             WHERE notification_id = ?`,

            [notificationId]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({

                message: "Notification Not Found"

            });

        }

        res.status(200).json({

            message: "Notification Marked As Read"

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

    getNotifications,
    markRead

};