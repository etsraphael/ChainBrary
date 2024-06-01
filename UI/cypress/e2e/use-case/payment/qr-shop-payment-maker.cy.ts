/// <reference types="cypress" />

import '@angular/compiler';

describe('Create a QR code payment for shops', () => {


  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}`);
    cy.get('[data-id="explore-solutions"]').click();
    cy.get('[data-id="btn-shop-qr-code"]').click();
  });



  it('Start payment generate a payment with Metamask', () => {
    // TODO: Implement test
  });
});

