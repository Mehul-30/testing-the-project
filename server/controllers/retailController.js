const db = require("../database/connectDatabase");

const buyStock = async (req, res) => {

    const connection = await db.getConnection();

    try {

        const {
            user_id,
            stock_id,
            quantity
        } = req.body;

        await connection.beginTransaction();

        // Get stock details
        const [rows] = await connection.query(

            `SELECT stock_name, quantity
             FROM stocks
             WHERE stock_id=?`,

            [stock_id]

        );

        if (rows.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                message: "Stock Not Found"

            });

        }

        const stockName = rows[0].stock_name;
        const availableQuantity = rows[0].quantity;

        // Not enough stock
        if (availableQuantity < quantity) {

            const [waiting] = await connection.query(

                `SELECT *
                 FROM wanted_stocks
                 WHERE user_id=? AND stock_id=? AND notified=false`,

                [user_id, stock_id]

            );

            if (waiting.length === 0) {

                await connection.query(

                    `INSERT INTO wanted_stocks
                    (user_id, stock_id, requested_quantity)
                    VALUES (?,?,?)`,

                    [user_id, stock_id, quantity]

                );

            }

            await connection.commit();

            return res.status(400).json({

                message: "Insufficient stock. Added to waiting list."

            });

        }

        // Reduce stock quantity
        await connection.query(

            `UPDATE stocks
             SET quantity = quantity - ?
             WHERE stock_id=?`,

            [quantity, stock_id]

        );

        // Record purchase
        await connection.query(

            `INSERT INTO retail
            (user_id, stock_id, quantity)
            VALUES (?,?,?)`,

            [user_id, stock_id, quantity]

        );

        // Check updated quantity
        const [updated] = await connection.query(

            `SELECT quantity
             FROM stocks
             WHERE stock_id=?`,

            [stock_id]

        );

        const currentQuantity = updated[0].quantity;

        // Low stock alert
        if (currentQuantity < 5) {

            const [exists] = await connection.query(

                `SELECT *
                 FROM less_count_stocks
                 WHERE stock_id=?`,

                [stock_id]

            );

            if (exists.length === 0) {

                await connection.query(

                    `INSERT INTO less_count_stocks
                    (stock_id, current_quantity)
                    VALUES (?,?)`,

                    [stock_id, currentQuantity]

                );

            } else {

                await connection.query(

                    `UPDATE less_count_stocks
                     SET current_quantity=?
                     WHERE stock_id=?`,

                    [currentQuantity, stock_id]

                );

            }

            // Notify every manager
            const [managers] = await connection.query(

                `SELECT user_id
                 FROM users
                 WHERE role='manager'`

            );

            for (const manager of managers) {

                await connection.query(

                    `INSERT INTO notifications
                    (user_id, title, message, type)
                    VALUES (?,?,?,?)`,

                    [

                        manager.user_id,

                        "Low Stock Alert",

                        `${stockName} stock is low. Remaining quantity: ${currentQuantity}`,

                        "LOW_STOCK"

                    ]

                );

            }

        }

        await connection.commit();

        res.status(200).json({

            message: "Purchase Successful"

        });

    }

    catch (err) {

        await connection.rollback();

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

    finally {

        connection.release();

    }

};

const getPurchaseHistory = async (req, res) => {

    try {

        const userId = req.params.userId;

        const [rows] = await db.query(

            `SELECT
                r.retail_id,
                s.stock_name,
                r.quantity,
                r.purchased_at

             FROM retail r

             JOIN stocks s
             ON r.stock_id = s.stock_id

             WHERE r.user_id=?

             ORDER BY r.purchased_at DESC`,

            [userId]

        );

        res.status(200).json(rows);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Database Error"

        });

    }

}

module.exports = {

    buyStock,
    getPurchaseHistory

};