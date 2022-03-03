const chai = require("chai")
const expect = require("chai").expect
const chaiHttp = require("chai-http")
const server = require("../../../server.js")
chai.use(chaiHttp)
const delivery = require("../../../controllers/admin/deliveryController.js")
const order = require("../../../controllers/admin/orderController.js")
const item = require("../../../controllers/admin/itemActionController.js")
const Felhasználó = require("../../../models/felhasználó")
const date = require("../../../src/middlewares/date")

//deliveryController.js
describe('Admin - deliveryController', () => {
    let futárok, name, email, password1
    
    before(() => {
        futárok = [{ createdAt: "2022-01-06T20:07:23.806+00:00" }, { createdAt: "2022-02-06T20:07:23.806+00:00" }]
        name = "dummyFutár"
        email = "dummyEmail"
        password1 = "dummyPassword1"
    });
    
    //formatCreatedAt()
    it('Futár létrehozásának formázása (év-hónap-nap) alakra - formatCreateAt()', () => {
       delivery.formatCreateAt(futárok)
       expect(futárok[0].createdAt).to.be.equal("2022-01-06")
       expect(futárok[1].createdAt).to.be.equal("2022-02-06")
    });

    //Útvonalak
    describe('deliveryController útvonalak', () => {
        it('GET /futarok', (done) => {
            chai.request(server) 
                .get("/futarok")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                }) 
                done()
        });
    
        it('GET /futarok/register', (done) => {
            chai.request(server)
                .get("/futarok/register")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                }) 
                done()
        });
    
        it('GET /futarok/kiosztas', (done) => {
            chai.request(server)
                .get("/futarok/kiosztas")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                }) 
                done()
        });
    });

    //assignToDelMan
    describe('Rendelés hozzáadása a futárokhoz - assignToDelMan()', () => {
        let futárIds, futárNames, rendelések, üresRendelések, üresFutárIds

        before(() => {
            futárIds = ["1", "2"]
            futárNames = ["Béla", "Géza"]
            rendelések = [{futárId: "1"}, {futárId: "1"}, {futárId: "2"} ]
            üresRendelések = [],
            üresFutárIds = []
        });

        it('Vissza kell adnia a tömböt, ahol futárokhoz rendelés lett kiosztva', () => {
            let futárHozzárendelés = delivery.assignToDelMan(futárIds, rendelések, futárNames)
            expect(futárHozzárendelés).to.be.a("array")
            expect(futárHozzárendelés).to.have.lengthOf(2)
            expect(futárHozzárendelés[0]).to.have.lengthOf(2)
            expect(futárHozzárendelés[1]).to.have.lengthOf(1)
        });

        it('Rendelés hiányában üres tömböt kell visszaadnia', () => {
            let futárHozzárendelés = delivery.assignToDelMan(futárIds, üresRendelések, futárNames)
            expect(futárHozzárendelés).to.be.a("array")
            expect(futárHozzárendelés).to.have.lengthOf(0)
        });

        it('Futár hiányában üres tömböt kell visszaadnia', () => {
            let futárHozzárendelés = delivery.assignToDelMan(üresFutárIds, rendelések, futárNames)
            expect(futárHozzárendelés).to.be.a("array")
            expect(futárHozzárendelés).to.have.lengthOf(0)
        });
    });

    //createDeliveryMan
    it('futár létrehozása, vissza kell adnia futár objektumot - createDeliveryMan()', () => {
         delivery.createDeliveryMan(name, email, password1).then((futár) => {
             expect(futár).to.be.a("object")
             expect(futár.név).to.be.eql("dummyFutár")
             expect(futár.email).to.be.eql("dummyEmail")
             expect(futár.beosztás).to.be.eql("futár")
             expect(futár.jelszó).to.be.a("string")
         })
    });

    //postRegister - futár
    describe('futár regisztráció', () => {
        let name = "smthName"
        let email = "smthEmail"
        let correctPw1 = "12345"
        let pw2 = "12345"
        let incorrectPw1 = "12"
        

        it('helytelen adatok, redirectelnie kell', (done) => {
            chai.request(server) 
                .get("/futarok")
                .send({name: name, email: email, password1: incorrectPw1, password2: pw2})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                }) 
                done()
        });
    });
})

//itemActionController.js
describe('Admin - itemActionController', () => {
       let név = "dummyName"
       let leírás = " Lorem ipsum"
       let error = "dummyError"
       let correctár = 5
       let NanÁr = "sorry"
       let negativeÁr = -1

    beforeEach(() => {
        req = { errors: {}, flash: function (type, text) { this.errors[type] = text }}
    });

    //hibakezelés()
    it('a req-be be kell jegyeznie a hibát - hibakezelés()', () => {
        item.hibakezelés(név, leírás, error, req)

        expect(req.errors.árError).to.be.eql(error)
        expect(req.errors.név).to.be.eql(név)
        expect(req.errors.leírás).to.be.eql(leírás)
    });

    //incorrectData()
    describe('megadot adatok ellenőrzése - incorrectData()', () => {
        it('helyes adatok megadva, false-t kell visszaadnia', () => {
            let result = item.incorrectData(correctár, név, leírás, req)

            expect(result).to.be.false
        });

        it('helytelen (nem szám) ár megadva, true-t kell visszaadnia', () => {
            let result = item.incorrectData(NanÁr, név, leírás, req)
            
            expect(result).to.be.true
        });

        it('helytelen (negatív) ár megadva, true-t kell visszaadnia', () => {
            let result = item.incorrectData(negativeÁr, név, leírás, req)
            
            expect(result).to.be.true
        });
    })

    //createImageName()
    it('helyes formában kell megadnia a kép nevét () - createImageName()', () => {
        let kép1 = "képecske.jpg"
        let currentDate = item.createImageName("2022/02/28", kép1)

        expect(currentDate).to.be.eql("képecske20220228.jpg")
      
    });

    //determinePath()
    describe('redirect útvonal meghatározása - redirectPath()', () => {
       let üditőDoc, doc
       
        before(() => {
            üditőDoc = { kategória: "üdítő"}
            doc = { kategória: "dummy"}
        });

        it('üdítő kategória esetén /udito-t kell visszaadnia', () => {
            let res = item.determinePath(üditőDoc)
            expect(res).to.be.eql("/udito")
        });

        it('nem üditő kategória esetén /{kategória}-t kell visszaadnia', () => {
            let res = item.determinePath(doc)
            expect(res).to.be.eql("/dummy")
        });
    });

    //updateTermék()
    it('vissza kell adnia a frissített terméket - updateTermék ', async () => {
        const név = "dummyNév"
        const ár = "1"
        const kategória = "dummyCategory"
        const newKép = "dummyKép"
        const leírás = "Lorem ipsum"
        const termékId = "5"

        let Termék = { 
                          findOneAndUpdate: (obj1, obj2, obj3) => { 
                              return new Promise(resolve => {
                                  let updated = {
                                      név: név,
                                      ár: ár,
                                      kategória: kategória,
                                      leírás: leírás,
                                      kép: newKép
                                  }
                                  resolve(updated)
                              })
                          }
                       }

        let result = await item.updateTermék(név, ár, kategória, leírás, newKép, termékId, Termék)

        expect(result).to.be.a("object")
        expect(result.név).to.be.eql("dummyNév")
        expect(result.ár).to.be.eql("1")
        expect(result.kategória).to.be.eql("dummyCategory")
        expect(result.kép).to.be.eql("dummyKép")
        
    });
})

//admin - ordercontroller.js
describe('Admin - ordercontroller', () => {
    let rendelések = [{
        valami: "béla",
        termékek: {
            '3000': {
              item: {
                _id: 3000,
                'név': 'Nutellás',
                'ár': 1.5,
                'kép': 'nutellás.jpg',
                'kategória': 'palacsinta',
                'leírás': '2 db Palacsinta nutellával töltve'
              },
              quantity: 1
            },
            '4002': {
              item: {
                _id: 4002,
                'név': 'Lipton peach',
                'ár': 1.2,
                'kép': 'lipton peach.png',
                'kategória': 'üdítő'
              },
              quantity: 2
            }
          }
    },
    { valami: "géza",
      termékek: { '3000': {
        item: {
          _id: 3000,
          'név': 'Nutellás',
          'ár': 1.5,
          'kép': 'nutellás.jpg',
          'kategória': 'palacsinta',
          'leírás': '2 db Palacsinta nutellával töltve'
        },
        quantity: 1}}
    }
   ]
      
    it('szeparálnia kell a termékeket a rendelésektől rendelők szerint - seperateTermékek()', () => {
        let res = order.seperateTermékek(rendelések)
        expect(res).to.be.a("array")
        expect(res).to.have.lengthOf(2)
        expect(res[0]).to.have.lengthOf(2)
        expect(res[1]).to.have.lengthOf(1)
    });

    it('Megfelelő alakban (string) kell visszadnia a termékeket - formatTermékek', () => {
        let seperated = order.seperateTermékek(rendelések)
        let res = order.formatTermékek(seperated)

        expect(res).to.be.a("array")
        expect(res).to.have.lengthOf(2)
        expect(res[0]).to.be.eql("Nutellás 1 db\nLipton peach 2 db\n")
        expect(res[1]).to.be.eql("Nutellás 1 db\n")
    });
});