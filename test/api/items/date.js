const expect = require("chai").expect
const sinon = require("sinon")
const dateFormat = require("../../../src/middlewares/date")

describe('dátum manipuláció string formájában', () => {
    //formatDate
    describe('Mai dátum formázása', () => {
        it('megfelelő alakban kellene visszaadnia a megadott dátumot - formatDate()', () => {
            let today = new Date("Fri Feb 25 2022 13:37:34")
    
            let todayString = dateFormat.formatDate(today)
    
            expect(todayString).to.eql("2022/02/25")
    
        });
    });
});