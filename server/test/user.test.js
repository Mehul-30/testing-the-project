const request = require('supertest')

let expect;

before(async ()=>{
    const chai = await import('chai');
    expect = chai.expect
})


const app = require('../server');

let user_id;

describe("User test functions" , ()=>{

    describe("POST users/login", ()=>{
        it("To login a user", async ()=>{
            const response = await request(app).post("/users/login").send({
                username : "test_user1",
                password : "test_user1"
            })

            user_id = response.body.id

            expect(response.status).to.equal(200)

            expect(response.body.status).to.be.true

            expect(response.body.user.username).to.equal("test_user1")
        })
    })
})

describe("Stock test function", async()=>{
    describe("To check the function of stock controller file",()=>{
        it("To get all stocks GET /stocks/", async ()=>{
            const response = await request(app).get("/stocks/")

            expect(response.body.length).to.equal(50)
            expect(response.status).to.equal(200)
        })

        it("To buy a stock Post /retail/buy/", async()=>{
            const response = await request(app).post("/retail/buy/")
        })
    })
})