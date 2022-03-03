/// <reference types="cypress" />

describe('Bejelentkezés tesztelése', () => {
    it('bejelentkezés nem létező emaillel', () => {
        cy.viewport(1280, 720)
        cy.visit("https://gyorsetterem.herokuapp.com/")

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
        
        cy.url().should("eq", "https://gyorsetterem.herokuapp.com/")
        cy.get('[data-testid="logoutNav"]').should("exist")

    });
});

describe('Rendelés tesztelése', () => {
    it('Termékek hozzáadása a kosárhoz', () => {
        cy.get('[data-testid="pizzaNav"]').click()
        cy.url().should("eq", "https://gyorsetterem.herokuapp.com/pizza")
        cy.get('[data-testid="addBtn"]').first().click()

        cy.get('[data-testid="palacsintaNav"]').click()
        cy.url().should("eq", "https://gyorsetterem.herokuapp.com/palacsinta")
        cy.get('[data-testid="addBtn"]').first().click()

        cy.get('[data-testid="uditoNav"]').click()
        cy.url().should("eq", "https://gyorsetterem.herokuapp.com/udito")
        cy.get('[data-testid="addBtn"]').first().click()
    });
});