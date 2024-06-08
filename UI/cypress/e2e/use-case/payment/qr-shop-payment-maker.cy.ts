/// <reference types="cypress" />

import '@angular/compiler';

describe('Create a QR code payment for shops', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}`);
    cy.get('[data-id="explore-solutions"]').click();
    cy.get('[data-id="btn-shop-qr-code"]').click();
    cy.get('[data-id="btn-print-qr-code"]').click();
  });

  it('Show error message', () => {
    cy.get('[data-id="business-name"]').type('Test Business');
    cy.get('[data-id="btn-print-qr-code"]').click();

    cy.get('mat-snack-bar-container simple-snack-bar .mat-mdc-snack-bar-label')
      .should('be.visible')
      .contains('Please fill in all the required fields');

    cy.get('[data-id="owner-address"]').type('0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af');

    cy.get('[data-id="btn-print-qr-code"]').click();

    cy.get('mat-snack-bar-container simple-snack-bar .mat-mdc-snack-bar-label')
      .should('be.visible')
      .contains('Please select a template first');
  });

  it('Print a QR Code', () => {
    cy.get('[data-id="business-name"]').type('Test Business');
    cy.get('[data-id="owner-address"]').type('0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af');
    cy.get(`#shop-qr-code-visual-0`).click();

    // Check if the name is displayed
    cy.get('#shop-qr-code-visual-0 text').contains('Test Business').should('exist');
  });
});
