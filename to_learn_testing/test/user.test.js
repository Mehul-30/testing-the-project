const request = require("supertest");

let expect;

before(async function () {
    const chai = await import("chai");
    expect = chai.expect;
});


const app = require("../server");

describe("User API Testing", function () {

    describe("GET /api/users", function () {

        it("should return all users", async function () {

            const response = await request(app)
                .get("/api/users");

            expect(response.status).to.equal(200);

            expect(response.body.success).to.equal(true);

            expect(response.body.message)
                .to.equal("Users fetched successfully");

            expect(response.body.data).to.be.an("array");
        });

    });


    describe("GET /api/users/:id", function () {

        it("should return user when valid ID is provided", async function () {

            const response = await request(app)
                .get("/api/users/1");

            expect(response.status).to.equal(200);

            expect(response.body.success).to.equal(true);

            expect(response.body.message)
                .to.equal("User fetched successfully");

            expect(response.body.data.id).to.equal("1");

            expect(response.body.data.name).to.equal("John");
        });


        it("should return 404 when user does not exist", async function () {

            const response = await request(app)
                .get("/api/users/999");

            expect(response.status).to.equal(404);

            expect(response.body.success).to.equal(false);

            expect(response.body.message)
                .to.equal("User not found");
        });

    });

});