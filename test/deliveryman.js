const chai = require("chai")
const expect = require("chai").expect
const server = require("../server.js")
const chaiHttp = require("chai-http")
const deliveryController = require("../controllers/delivery/deliverymanController.js")
chai.use(chaiHttp)

describe('Futár útvonalak', () => {
    it('GET futar', (done) => {
        chai.request(server)
        .get("/futar")
        .end((err, res) => {
            expect(res).to.have.status(200);
        }) 
        done()
    });

    it('GET /futar/map', (done) => {
        chai.request(server)
        .get("/futar/map")
        .end((err, res) => {
            expect(res).to.have.status(200);
        }) 
        done()
    });
});
