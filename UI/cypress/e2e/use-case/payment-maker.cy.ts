/// <reference types="cypress" />

describe('Create a payment request', () => {
  it('Start payment', () => {
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Complete profile information
    cy.get('app-payment-request-profile-settings [data-id="address-input"]').type(
      '0xbA3Fc0648186a79baEF8DCeE9e055873F432a351',
      { force: true }
    );
    cy.get('app-payment-request-profile-settings [data-id="username-input"]').type('My Username');
    cy.get('app-payment-request-profile-settings [data-id="submit-button"]').click();

    // Complete description
    cy.get('app-payment-request-price-settings [data-id="description-input"]').type(
      'This is my payment request description',
      { force: true }
    );

    cy.get('app-payment-request-price-settings [data-id="submit-button"]').click();

    // Check if app-payment-request-review is visible
    cy.get('app-payment-request-review').should('be.visible');
  });
});
