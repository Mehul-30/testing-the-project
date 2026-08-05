const db = require("../database/connectDatabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {

    try {

        const { full_name, username, password, role } = req.body;

        if (!full_name || !username || !password || !role) {

            return res.status(400).json({

                message: "All fields are required"

            });

        }

        const [exist] = await db.query(

            "SELECT * FROM users WHERE username=?",

            [username]

        );

        if (exist.length > 0) {

            return res.status(400).json({

                message: "Username already exists"

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(

            `INSERT INTO users
            (full_name,username,password,role)
            VALUES(?,?,?,?)`,

            [

                full_name,
                username,
                hashedPassword,
                role

            ]

        );

        res.status(201).json({

            message: "User Registered Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// Login
const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const [rows] = await db.query(

            "SELECT * FROM users WHERE username=?",

            [username]

        );

        if (rows.length === 0) {

            return res.status(401).json({

                message: "Invalid Username or Password"

            });

        }

        const user = rows[0];

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.status(401).json({

                message: "Invalid Username or Password"

            });

        }

        const token = jwt.sign(

            {

                id: user.user_id,
                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );

        res.status(200).json({

            message: "Login Successful",

            token,

            user: {

                id: user.user_id,
                name: user.full_name,
                username: user.username,
                role: user.role

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// Get User Notifications
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

            message: "Server Error"

        });

    }

};


// Mark Notification as Read
const markNotificationRead = async (req, res) => {

    try {

        await db.query(

            `UPDATE notifications

             SET is_read=true

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

            message: "Server Error"

        });

    }

};


module.exports = {

    register,
    login,
    getNotifications,
    markNotificationRead

};