const chai = require("chai")
const expect = require("chai").expect
const chaiHttp = require("chai-http")
const server = require("../../../server.js")
const orderController = require("../../../controllers/customer/orderController.js")
const Rendelés = require("../../../models/rendelés")
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
chai.use(chaiHttp)

describe('Rendelés útnovalak és függvények', () => {
    let telefonszám, cím, coordsArray, req

    before(() => {
        //Adatok
        telefonszám = "091234568"
        cím = "dummy address"
        koordináta = ["0.54", "0.44"] 
        req = { user: { _id: "61d84fdb9ebc9c0016365d71" }, 
                session: { cart: { items: { ár: 5, név: "dummy"}}}
              }
        
        //Mock mongodb      
        const Mockgoose = require("mockgoose").Mockgoose
        const mockgoose = new Mockgoose(mongoose)    

        mockgoose.prepareStorage()
            .then(() => {
                mongoose.connect('mongodb://localhost/test',
                    { useNewUrlParser: true, useCreateIndex: true })
                    .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                    })
                })      
    });
    
    it('GET /vasarlo/rendelesek', (done) => {
        chai.request(server)
        .get("/vasarlo/rendelesek")
        .end((err, res) => {
            expect(res).to.have.status(200);
        }) 
        done()
    });

    it('GET /vasarlo/rendelesek/:id', (done) => {
        chai.request(server)
        .get("/vasarlo/rendelesek/1")
        .end((err, res) => {
            expect(res).to.have.status(200);
        }) 
        done()
    });
    
    describe('kulcsokat és összes áru ár*mennyiség összeget kell visszaadnia - key() ', () => {
        let rendelés 
        let nRendelés

        before(() => {
            rendelés = { termékek: { 1: { item: { ár: 2 }, quantity: 1 }, 
                                         2: { item: { ár: 1 }, quantity: 2 }
                                   }
                       }
            nRendelés = { termékek: {}}
        });

        after(() => {
            mongoose.disconnect()
        });

        it('termékek esetén összegnek nem 0 kell lennie és kulcsokat kell visszaadnia ', () => {
            let results = orderController.key(rendelés)

            expect(results.keys).to.be.a("array")
            expect(results.keys).to.have.members(["1", "2"])
            expect(results.összeg).to.be.equal(4)
        }); 

        it('ha nincs termék összeg 0-nak kell lennie és nincs kulcs', () => {
            let results = orderController.key(nRendelés)

            expect(results.összeg).to.be.equal(0)
            expect(results.keys).to.be.empty
        });
    });

    it('vissza kell adnia az elmentet dokumentumot - saveRendelés()', (done) => {
        orderController.saveRendelés(req, telefonszám, cím, koordináta)
            .then(result => {
                expect(result).to.be.a("object")
            })
            done()
     
    });
});