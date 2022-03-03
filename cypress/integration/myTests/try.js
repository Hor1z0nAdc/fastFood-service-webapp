/// <reference types="cypress" />

describe.only('', () => {
    it('weboldal betöltődik', () => {
        cy.viewport(1280, 720)
        cy.visit("https://gyorsetterem.herokuapp.com/")
        cy.get('[data-testid="bejelentkezes"]').click()
    });

    it('bejelentkezés nem létező emaillel', () => {

    });
});