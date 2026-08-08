// const request = require('supertest');
// const { response } = require('../server');

// let expect;

// before(async ()=>{
//     const chai = await import('chai');
//     expect = chai.expect
// })

// const app = require('../server')

// const user_id = 12;
// const stock_id = 38;

// describe("Stock test function", async()=>{
//     describe("To check the function of stock controller file",()=>{

//         const qnt=4;


//         it("To get all stocks GET /stocks/", async ()=>{
//             const response = await request(app).get("/stocks/")

//             expect(response.body.length).to.equal(50)
//             expect(response.status).to.equal(200)
//         })

//         it("To buy a stock Post /retail/buy/", async()=>{
            
//             const response = await request(app).post("/retail/buy/").send({
//                 user_id,
//                 stock_id,
//                 quantity : qnt
//             })


//             expect(response.status).to.equal(200)

//             expect(response.body.afterUpdate).to.equal(response.body.beforeUpdate-qnt);
//         })

        
        
//     })
// })

const request = require("supertest");

let expect;

before(async ()=>{
    const chai = await import('chai');
    expect = chai.expect
})

const app = require("../server");
const db = require("../database/connectDatabase");


const USER_ID = 12;
const STOCK_ID = 38;


async function setStockQuantity(quantity) {
    await db.query(
        `UPDATE stocks
         SET quantity = ?
         WHERE stock_id = ?`,
        [quantity, STOCK_ID]
    );
}


async function deleteWaitingRecord() {
    await db.query(
        `DELETE FROM wanted_stocks
         WHERE user_id = ?
         AND stock_id = ?`,
        [USER_ID, STOCK_ID]
    );
}


async function deleteLowStockRecord() {
    await db.query(
        `DELETE FROM less_count_stocks
         WHERE stock_id = ?`,
        [STOCK_ID]
    );
}


async function deleteNotifications() {
    await db.query(
        `DELETE FROM notifications
         WHERE type = 'LOW_STOCK'
         AND message LIKE ?`,
        [`%stock%`]
    );
}


async function getStockQuantity() {
    const [rows] = await db.query(
        `SELECT quantity
         FROM stocks
         WHERE stock_id = ?`,
        [STOCK_ID]
    );

    return rows[0].quantity;
}


describe("POST /retail/buy - Buy Stock Controller", function () {


    beforeEach(async function () {

        await setStockQuantity(10);


        await deleteWaitingRecord();

    
        await deleteLowStockRecord();

    });


    it("should return 404 when stock does not exist", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: 999999,
                quantity: 2
            });


        expect(response.status).to.equal(404);

        expect(response.body.message)
            .to.equal("Stock Not Found");

    });


    it("should successfully buy stock", async function () {


        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 2
            });


        expect(response.status).to.equal(200);

        expect(response.body.message)
            .to.equal("Purchase Successful");

        expect(response.body.beforeUpdate)
            .to.equal(10);

        expect(response.body.afterUpdate)
            .to.equal(8);

        expect(
            response.body.afterUpdate
        ).to.equal(
            response.body.beforeUpdate - 2
        );


        // Check actual database
        const quantity = await getStockQuantity();

        expect(quantity).to.equal(8);

    });


    it("should create a retail record after successful purchase", async function () {

        const quantity = 2;

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity
            });


        expect(response.status).to.equal(200);


        const [rows] = await db.query(
            `SELECT *
             FROM retail
             WHERE user_id = ?
             AND stock_id = ?
             AND quantity = ?
             ORDER BY retail_id DESC
             LIMIT 1`,
            [
                USER_ID,
                STOCK_ID,
                quantity
            ]
        );


        expect(rows.length).to.equal(1);

        expect(rows[0].user_id)
            .to.equal(USER_ID);

        expect(rows[0].stock_id)
            .to.equal(STOCK_ID);

        expect(rows[0].quantity)
            .to.equal(quantity);

    });


    it("should return 400 when requested quantity is greater than available stock", async function () {


        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 20
            });


        expect(response.status).to.equal(400);

        expect(response.body.message)
            .to.equal(
                "Insufficient stock. Added to waiting list."
            );


        // Stock must remain unchanged
        const currentQuantity = await getStockQuantity();

        expect(currentQuantity).to.equal(10);

    });



    it("should add the user to wanted_stocks when stock is insufficient", async function () {

        const requestedQuantity = 20;


        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: requestedQuantity
            });


        expect(response.status).to.equal(400);


        const [rows] = await db.query(
            `SELECT *
             FROM wanted_stocks
             WHERE user_id = ?
             AND stock_id = ?
             AND notified = false`,
            [
                USER_ID,
                STOCK_ID
            ]
        );


        expect(rows.length).to.equal(1);

        expect(rows[0].requested_quantity)
            .to.equal(requestedQuantity);

    });


    it("should not create duplicate wanted_stocks records", async function () {

        const requestedQuantity = 20;


        // First request
        await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: requestedQuantity
            });


        // Second request
        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: requestedQuantity
            });


        expect(response.status).to.equal(400);


        const [rows] = await db.query(
            `SELECT *
             FROM wanted_stocks
             WHERE user_id = ?
             AND stock_id = ?
             AND notified = false`,
            [
                USER_ID,
                STOCK_ID
            ]
        );


        expect(rows.length).to.equal(1);

    });



    it("should allow buying exactly the available quantity", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 10
            });


        expect(response.status).to.equal(200);

        expect(response.body.beforeUpdate)
            .to.equal(10);

        expect(response.body.afterUpdate)
            .to.equal(0);

    });


    it("should create less_count_stocks record when stock becomes less than 5", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 6
            });


        expect(response.status).to.equal(200);

        expect(response.body.afterUpdate)
            .to.equal(4);


        const [rows] = await db.query(
            `SELECT *
             FROM less_count_stocks
             WHERE stock_id = ?`,
            [STOCK_ID]
        );


        expect(rows.length).to.equal(1);

        expect(rows[0].current_quantity)
            .to.equal(4);

    });

    it("should update existing less_count_stocks record", async function () {

        await db.query(
            `INSERT INTO less_count_stocks
             (stock_id, current_quantity)
             VALUES (?, ?)`,
            [
                STOCK_ID,
                100
            ]
        );



        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 6
            });


        expect(response.status).to.equal(200);


        const [rows] = await db.query(
            `SELECT *
             FROM less_count_stocks
             WHERE stock_id = ?`,
            [STOCK_ID]
        );


        expect(rows.length).to.equal(1);

        expect(rows[0].current_quantity)
            .to.equal(4);

    });



    it("should create low-stock notifications for managers", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 6
            });


        expect(response.status).to.equal(200);



        const [managers] = await db.query(
            `SELECT user_id
             FROM users
             WHERE role = 'manager'`
        );


        expect(managers.length)
            .to.be.greaterThan(0);


        for (const manager of managers) {

            const [notifications] = await db.query(
                `SELECT *
                 FROM notifications
                 WHERE user_id = ?
                 AND type = 'LOW_STOCK'
                 ORDER BY notification_id DESC
                 LIMIT 1`,
                [manager.user_id]
            );


            expect(notifications.length)
                .to.equal(1);


            expect(notifications[0].title)
                .to.equal("Low Stock Alert");

        }

    });


    it("should contain stock information in notification", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 6
            });


        expect(response.status).to.equal(200);


        const [managers] = await db.query(
            `SELECT user_id
             FROM users
             WHERE role = 'manager'`
        );


        for (const manager of managers) {

            const [notifications] = await db.query(
                `SELECT message
                 FROM notifications
                 WHERE user_id = ?
                 AND type = 'LOW_STOCK'
                 ORDER BY notification_id DESC
                 LIMIT 1`,
                [manager.user_id]
            );


            expect(notifications.length)
                .to.equal(1);


            expect(notifications[0].message)
                .to.include("Remaining quantity: 4");

        }

    });


    it("should reject zero quantity", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: 0
            });


        expect(response.status).to.equal(400);

    });


    it("should reject negative quantity", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID,
                quantity: -5
            });



        expect(response.status).to.equal(400);

    });



    it("should reject missing quantity", async function () {

        const response = await request(app)
            .post("/retail/buy/")
            .send({
                user_id: USER_ID,
                stock_id: STOCK_ID
            });



        expect(response.status).to.equal(400);

    });


    after(async function () {

        await setStockQuantity(10);

        await deleteWaitingRecord();

        await deleteLowStockRecord();


    });

});