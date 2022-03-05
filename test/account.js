const chai = require("chai")
const expect = require("chai").expect
const server = require("../server.js")
const sinon = require("sinon")
const accountF = require("../src/functions/accountFunctions.js")
const chaiHttp = require("chai-http")
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
chai.use(chaiHttp)

describe('felhasználó útvonalak tesztelése', () => {
    it('GET /regisztracio', (done) => {
        chai.request(server)
            .get("/regisztracio")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
        done()
    });

    it('GET /bejelentkezes', (done) => {
        chai.request(server)
            .get("/bejelentkezes")
            .end((err, res) => {
                expect(res).to.have.status(200);
            }) 
        done()
    });
});

describe('felhasználó függvények tesztelése', () => {
    //registerValidation()
    describe('regisztrációs adatok validátciója - registerValidation()', () => {
        const validParams = { name: "Géza", email: "dummymail@dummy.com", password1: "12345", password2: "12345"}
        const invalidName = { name: "ko", email: "dummymail@dummy.com", password1: "12345", password2: "12345"}
        const invalidEmail = { name: "Géza", email: undefined, password1: "12345", password2: "12345"}
        const invalidPassword1 = { name: "Géza", email: "dummymail@dummy.com", password1: "1234", password2: "12345"}
        const invalidPassword2 = { name: "Géza", email: "dummymail@dummy.com", password1: "12345", password2: "123456"}
        let req

        beforeEach(() => {
            req = { errors: {}, flash: function (type, text) { this.errors[type] = text }}
        });

        it('helyes paraméterek megadva - nem kellene lennie hibának', () => {
            let isError = accountF.registerValidation(validParams.name, validParams.email, validParams.password1, validParams.password2, req)
            expect(isError).to.be.false
        });

        it('helytelen név megadva -  név hibát kell jeleznie', () => {
            let isError = accountF.registerValidation(invalidName.name, invalidName.email, invalidName.password1, invalidName.password2, req)
            expect(isError).to.be.true
            expect(req.errors.nameError).to.be.equal("A felhasználónévnek 3-16 karakter hosszúnak kell lennie.")
        });

        it('helytelen email megadva - email hibát kell jeleznie', () => {
            let isError = accountF.registerValidation(invalidEmail.name, invalidEmail.email, invalidEmail.password1, invalidEmail.password2, req)
            expect(isError).to.be.true
            expect(req.errors.emailError).to.be.equal("Meg kell adnia az email címét!")
        });

        it('helytelen jelszó megadva - jelszó hibát kell jeleznie', () => {
            let isError = accountF.registerValidation(invalidPassword1.name, invalidPassword1.email, invalidPassword1.password1, invalidPassword1.password2, req)
            expect(isError).to.be.true
            expect(req.errors.passwordError).to.be.equal("A jelszónak 5-16 karakter hosszúnak kell lennie.")
        });

        it('nem megegyező jelszó - jelszó hibát kell jeleznie', () => {
            let isError = accountF.registerValidation(invalidPassword2.name, invalidPassword2.email, invalidPassword2.password1, invalidPassword2.password2, req)
            expect(isError).to.be.true
            expect(req.errors.password2Error).to.be.equal("A két jelszó nem egyezik!")
        });
    });

    describe('foglalt email ellenőrzés - takenEmail()', () => {
        let req
        let name
    
        before(() => {
            req = { errors: {}, flash: function (type, text) { this.errors[type] = text }}
            name = "dummyName"
        //     mongoose.disconnect()
        //     const Mockgoose = require("mockgoose").Mockgoose
        //     const mockgoose = new Mockgoose(mongoose)
            
        //     mockgoose.prepareStorage()
        //         .then(() => {
        //             mongoose.connect('mongodb://localhost/test',
        //                 { useNewUrlParser: true, useCreateIndex: true })
        //                 .then((res, err) => {
        //                 if (err) return reject(err);
        //                 resolve();
        //                 })
        //     })
        //     done()
        })

        it('foglalt jelszó esetén megfelelő hibaüzenet és név rögzítése', () => {
           accountF.takenEmail(name, req)
           expect(req.errors.emailError).to.be.eq("A megadott email már foglalt!")
        });
    });
});
