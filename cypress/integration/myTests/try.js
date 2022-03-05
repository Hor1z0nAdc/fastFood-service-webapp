/// <reference types="cypress" />

describe('Bejelentkezés tesztelése', () => {
    before(() => {
        cy.viewport(1280, 720)
        cy.visit("localhost:3000")
    });

    it('bejelentkezés nem létező emaillel', () => {

        cy.get('[data-testid="loginNav"]').click()
        cy.url().should("contain", "bejelentkezes")

        cy.get('[data-testid="emailInput"]').type("notExistingEmail@something.com")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click()
        cy.get(".text-red-700").should("exist").should("contain.text", "Nincs ilyen email regisztrálva.")
    });

    it('bejelentkezés hiteles adatokkal', () => {
        cy.get('[data-testid="emailInput"]').type("vasarlo@v")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click()
        
        cy.get('[data-testid="logoutNav"]').should("exist")

    });
});

describe('Rendelés tesztelése', () => {
    before(() => {
        cy.viewport(1280, 720)
        cy.visit("localhost:3000")
    });

    it('Termékek hozzáadása a kosárhoz', () => {
        cy.get('[data-testid="pizzaNav"]').click()
        cy.url().should("contain", "pizza")
        cy.get('[data-testid="addBtn"]').first().click()

        cy.get('[data-testid="palacsintaNav"]').click()
        cy.url().should("contain", "palacsinta")
        cy.get('[data-testid="addBtn"]').first().click()

        cy.get('[data-testid="uditoNav"]').click()
        cy.url().should("contain", "udito")
        cy.get('[data-testid="addBtn"]').first().click()

        cy.get('[data-testid="cartNav"]').click()
        cy.get('[data-testid="plusAction"]').first().click()
        cy.get('[data-testid="plusAction"]').eq(1).click()
        cy.get('[data-testid="minusAction"]').eq(1).click()
        cy.get('[data-testid="deleteAction"]').eq(2).click()
    
        cy.get('[data-testid="termekMennyiseg"]').first().should("contain.text", 2)
        cy.get('[data-testid="termekMennyiseg"]').eq(1).should("contain.text", 1)
        cy.get('[data-testid="termekMennyiseg"]').eq(2).should("not.exist")
    
        cy.contains("Jelentkezzen be a folytatáshoz").click({force: true})
        cy.get('[data-testid="emailInput"]').type("vasarlo@v")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click()
        cy.get('[data-testid="cartNav"]').click()
    
        cy.get('[data-testid="phoneInput"]').type("0101010101")
        cy.get('[data-testid="addressInput"]').type("brati")
        cy.contains("Bratislavská").click()
        cy.get('[data-testid="orderBtn"]').click()
    
        cy.get('[data-testid="rendeleseimNav"]').click()
        cy.url().should("contain", "rendelesek/")
        cy.get('[data-testid="rendelesId"]').first().then(($btn) => {
            const txt = $btn.text()
            cy.get('[data-testid="rendelesId"]').first().click()
            
            cy.get('[data-testid="rendelesId"]').should("contain.text", txt)
          })
    });
});

describe('Termék hozzadásának tesztelése', () => {
    let filepath ="test.png"

    before(() => {
        cy.viewport(1280, 720)
        cy.visit("localhost:3000")
        cy.get('[data-testid="loginNav"]').click()
        cy.get('[data-testid="emailInput"]').type("admin@a")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click() 
    });
    
    beforeEach(() => {
        cy.viewport(1280, 720)
        Cypress.Cookies.preserveOnce("connect.sid")
    });

    after(() => {
        cy.clearCookie("connect.sid")
    });

    it('Termék feltöltés', () => {
        cy.contains("Pizzák").click()
        cy.get('[data-testid="uploadBtn"]').click()
        cy.get('[data-testid="nameInput"]').clear().type("Test")
        cy.get('[data-testid="priceInput"]').clear().type("4.40")
        cy.get('[data-testid="descrInput"]').clear().type("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
        cy.get('input[type="file"]').attachFile(filepath, { subjectType: 'input' }) 
        cy.get('[data-testid="uploadBtn"]').click()
        cy.contains("Lorem ipsum dolor sit amet, consectetur adipiscing elit.").should("exist")

    });

    it('Termék változtatás', () => {
        cy.get('[data-testid="valtoztatBtn"]').last().click()
        cy.get('[data-testid="nameInput"]').clear().type("Changed Test")
        cy.get('[data-testid="priceInput"]').clear().type("5.00")
        cy.get('[data-testid="submitBtn"]').click()
        cy.contains("Changed Test").should("exist")
    });

    it('Termék törlés', () => {
        cy.get('[data-testid="deleteBtn"]').last().click()
        cy.contains('igen').click()
        cy.contains('OK').click()
        cy.contains("Changed Test").should("not.exist")
    });
});


describe('Futár felvételének tesztelése', () => {
    before(() => {
        cy.visit("localhost:3000")
        cy.get('[data-testid="loginNav"]').click()
        cy.get('[data-testid="emailInput"]').type("admin@a")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click() 
    });
    
    beforeEach(() => {
        cy.viewport(1280, 720)
        Cypress.Cookies.preserveOnce("connect.sid")
    });

    after(() => {
        cy.clearCookie("connect.sid")
    });
    
    it('Futár felvétele helytelen névvel ', () => {

        cy.get('[data-testid="futarokNav"]').click()
        cy.url().should("contain", "futarok")
        cy.get('[data-testid="felvetelInput"]').click()
        cy.url().should("contain", "futarok/register")

        cy.get('[data-testid="nameInput"]').type("ab")
        cy.get('[data-testid="emailInput"]').type("futarEmail@something.com")
        cy.get('[data-testid="pw1Input"]').type("12345")
        cy.get('[data-testid="pw2Input"]').type("12345")
        cy.get('[data-testid="registerBtn"]').click()
        cy.get('[data-testid="nameError"]').should("exist").should("contain.text", "A felhasználónévnek 3-16 karakter hosszúnak kell lennie.")

    });

    it('Futár felvétele foglalt email-lel', () => {
        cy.get('[data-testid="nameInput"]').type("dummyName")
        cy.get('[data-testid="emailInput"]').clear().type("futar@f")
        cy.get('[data-testid="pw1Input"]').type("12345")
        cy.get('[data-testid="pw2Input"]').type("12345")
        cy.get('[data-testid="registerBtn"]').click()
        cy.get('[data-testid="emailError"]').should("exist").should("contain.text", "A megadott email már foglalt!")
    });

    it('Futár felvétele helytelen jelszóval', () => {
        cy.get('[data-testid="nameInput"]').type("dummyName")
        cy.get('[data-testid="emailInput"]').clear().type("dummyFutar@something.com")
        cy.get('[data-testid="pw1Input"]').type("123")
        cy.get('[data-testid="pw2Input"]').type("123")
        cy.get('[data-testid="registerBtn"]').click()
        cy.get('[data-testid="pw1Error"]').should("exist").should("contain.text", "A jelszónak 5-16 karakter hosszúnak kell lennie.")
    });

    it('Futár felvéltele nem megegyező jelszóval', () => {
        cy.get('[data-testid="nameInput"]').type("dummyName")
        cy.get('[data-testid="emailInput"]').clear().type("dummyFutar@something.com")
        cy.get('[data-testid="pw1Input"]').type("12345")
        cy.get('[data-testid="pw2Input"]').type("123456")
        cy.get('[data-testid="registerBtn"]').click()
        cy.get('[data-testid="pw2Error"]').should("exist").should("contain.text", "A két jelszó nem egyezik!")
    })

    it('Futár felvétele hiteles adatokkal', () => {
        cy.get('[data-testid="nameInput"]').type("dummyFutár")
        cy.get('[data-testid="emailInput"]').clear().type("dummyFutar@something.com")
        cy.get('[data-testid="pw1Input"]').type("12345")
        cy.get('[data-testid="pw2Input"]').type("12345")
        cy.get('[data-testid="registerBtn"]').click()
        cy.contains("dummyFutár").should("exist")
    });

});

describe('Rendelés állapotának változtatása', () => {
    before(() => {
        cy.visit("localhost:3000")
        cy.get('[data-testid="loginNav"]').click()
        cy.get('[data-testid="emailInput"]').type("admin@a")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click() 
    }); 

    after(() => {
        cy.clearCookie("connect.sid")
    });

    it('', () => {
         cy.get('[data-testid="rendelesekNav"]').click()
         cy.get('[data-testid="selectInput"]').first().select("Elkészítve")
         cy.contains("Elkészítve").should("exist")
    });
});

describe('Rendelés futárhoz', () => {
    before(() => {
        cy.viewport(1280, 720)
        cy.visit("localhost:3000")
        cy.get('[data-testid="loginNav"]').click()
        cy.get('[data-testid="emailInput"]').type("admin@a")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click() 
    });
    
    beforeEach(() => {
        cy.viewport(1280, 720)
        Cypress.Cookies.preserveOnce("connect.sid")
    });

    after(() => {
        cy.clearCookie("connect.sid")
    });

    it('', () => {
        cy.get('[data-testid="rendelesekNav"]').click()
        cy.url().should("contain","rendelesek")
        cy.get('[data-testid="kiosztBtn"]').click()
        cy.url().should("contain","kiosztas")
        cy.get('[data-testid="check"]').first().click()
        cy.get('[data-testid="selectBtn"]').select("dummyFutár") 
        cy.get('[data-testid="hozzarendelBtn"]').click()

        cy.get('#hozzarendeles').within(($list) => {
            cy.contains("dummyFutár").should("exist")
        })
    });
});

describe('Futár ellenőrzése', () => {
    before(() => {
        cy.viewport(1280, 720)
        cy.visit("localhost:3000")
        cy.get('[data-testid="loginNav"]').click()
        cy.get('[data-testid="emailInput"]').type("dummyFutar@something.com")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click() 
    });

    it('Renedelés kiszállítva', () => {
        cy.contains("Kiszállítás megkezdése").click()
        cy.contains("0101010101").should("exist")
        cy.get('[data-testid="check"]').check()
        cy.get('[data-testid="deleteBtn"]').click()
        cy.contains("igen").click()
        cy.contains("0101010101").should("not.exist")
        cy.get('[data-testid="logoutNav"]').click()
       
    });
});

describe('Futár és rendelés törlése', () => {
    before(() => {
        cy.viewport(1280, 720)
        cy.visit("localhost:3000")
        cy.get('[data-testid="loginNav"]').click()
        cy.get('[data-testid="emailInput"]').type("admin@a")
        cy.get('[data-testid="passwordInput"]').type("12345")
        cy.get('[data-testid="loginBtn"]').click() 
    });

    beforeEach(() => {
        cy.viewport(1280, 720)
        Cypress.Cookies.preserveOnce("connect.sid")
    });

    after(() => {
        cy.clearCookie("connect.sid")
    });

    it('Futár törlése', () => {
        cy.get('[data-testid="futarokNav"]').click()
        cy.contains("dummyFutar@something.com").should("exist")
        cy.get('[data-testid="deleteBtn"]').last().click()
        cy.contains("igen").click()
        cy.contains("OK").click()
        cy.contains("dummyFutar@something.com").should("not.exist")
    });

    it('Rendelés törlése', () => {
        cy.get('[data-testid="rendelesekNav"]').click()
        cy.contains("vasarlo@v").should("exist")
        cy.get('[data-testid="selectInput"]').first().select("Lezárva")
        cy.get('[data-testid="deleteBtn"]').first().click()
        cy.contains("vasarlo@v").should("not.exist")
    });
    
});