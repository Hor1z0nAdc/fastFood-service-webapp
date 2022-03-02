const chai = require("chai")
const expect = require("chai").expect
const chaiHttp = require("chai-http")
const server = require("../../../server.js")
chai.use(chaiHttp)

describe("termék útvonalak", () => {
    it('index', (done) => {
        chai.request(server)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
            done()
    });

    it("GET /pizza", (done) => {
        chai.request(server)
            .get("/pizza")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
        done()
        })

    it("GET /hamburger", (done) => {
        chai.request(server)
            .get("/hamburger")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
        done()
    })

    it("GET /palacsinta", (done) => {
        chai.request(server)
            .get("/palacsinta")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
        done()
    })

    it("GET /udito", (done) => {
        chai.request(server)
            .get("/udito")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
        done()
    })
})