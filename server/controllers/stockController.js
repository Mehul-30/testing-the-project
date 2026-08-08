const db = require("../database/connectDatabase");


// Add quantity to temporary table
const addStock = async (req, res) => {
   

    try {

        const { stock_id, quantity } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM new_stocks WHERE stock_id=?",
            [stock_id]
        );

        if (rows.length > 0) {

            await db.query(
                `UPDATE new_stocks
                 SET quantity = quantity + ?
                 WHERE stock_id=?`,
                [quantity, stock_id]
            );

        } else {

            await db.query(
                `INSERT INTO new_stocks(stock_id, quantity)
                 VALUES(?, ?)`,
                [stock_id, quantity]
            );

        }

        res.status(200).json({
            message: "Added to temporary stock table"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};


// Import stocks to main table
const importStocks = async (req, res) => {

    

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Get all stocks waiting to be imported
        const [tempStocks] = await connection.query(
            "SELECT * FROM new_stocks"
        );

        // Update quantities in stocks table
        await connection.query(

            `UPDATE stocks s
             JOIN new_stocks ns
             ON s.stock_id = ns.stock_id
             SET s.quantity = s.quantity + ns.quantity`

        );

        // Notify waiting users
        for (const stock of tempStocks) {

            const [stockInfo] = await connection.query(

                `SELECT stock_name
                 FROM stocks
                 WHERE stock_id=?`,

                [stock.stock_id]

            );

            const stockName = stockInfo[0].stock_name;

            const [waitingUsers] = await connection.query(

                `SELECT *
                 FROM wanted_stocks
                 WHERE stock_id=?
                 AND notified=false`,

                [stock.stock_id]

            );

            for (const user of waitingUsers) {

                await connection.query(

                    `INSERT INTO notifications
                    (user_id, title, message, type)
                    VALUES(?,?,?,?)`,

                    [

                        user.user_id,

                        "Stock Available",

                        `${stockName} is now back in stock.`,

                        "NEW_STOCK"

                    ]

                );

            }

            await connection.query(

                `UPDATE wanted_stocks
                 SET notified=true
                 WHERE stock_id=?`,

                [stock.stock_id]

            );

            // Remove from low stock table if restocked
            await connection.query(

                `DELETE FROM less_count_stocks
                 WHERE stock_id=?`,

                [stock.stock_id]

            );

        }

        // Clear temporary table
        await connection.query(
            "DELETE FROM new_stocks"
        );

        await connection.commit();

        res.status(200).json({

            message: "Stocks Imported Successfully"

        });

    } catch (err) {

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


// View temporary table
const getNewStocks = async (req, res) => {

    

    try {

        const [rows] = await db.query(

            `SELECT
                ns.stock_id,
                s.stock_name,
                ns.quantity

             FROM new_stocks ns

             JOIN stocks s
             ON ns.stock_id = s.stock_id`

        );

        res.status(200).json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

};


// Get all stocks
const getAllStocks = async (req, res) => {


    try {

        const [rows] = await db.query(

            `SELECT
                s.stock_id,
                s.stock_name,
                s.quantity,
                c.category_name

             FROM stocks s

             JOIN categories c
             ON s.category_id = c.category_id`

        );


        res.status(200).json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

};


// Get one stock
const getStock = async (req, res) => {


    try {

        const id = req.params.id;

        const [rows] = await db.query(

            `SELECT
                s.stock_id,
                s.stock_name,
                s.quantity,
                c.category_name

             FROM stocks s

             JOIN categories c
             ON s.category_id = c.category_id

             WHERE s.stock_id=?`,

            [id]

        );

        if (rows.length === 0) {

            return res.status(404).json({

                message: "Stock Not Found"

            });

        }

        res.status(200).json(rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Database Error"

        });

    }

};


module.exports = {

    addStock,
    importStocks,
    getNewStocks,
    getAllStocks,
    getStock

};