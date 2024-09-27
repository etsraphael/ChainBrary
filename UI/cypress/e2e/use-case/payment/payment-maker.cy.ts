/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('Create a payment request with wallet', () => {
  beforeEach(() => {
    cy.login('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '...', NetworkChainId.POLYGON);
  });

  it('Start payment generate a payment with Metamask', () => {
    // Complete profile information
    cy.get('app-payment-request-profile-settings [data-id="username-input"]').type('My Username');
    cy.get('app-payment-request-profile-settings [data-id="submit-button"]').click();
    cy.get('app-payment-request-price-settings [data-id="submit-button"]').click();
  });
});

describe('Create a payment request without wallet', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/payment-request`);
  });
  it('Start payment generate a payment', () => {
    // Complete profile information
    cy.get('app-payment-request-profile-settings [data-id="address-input"]')
      .should('be.visible')
      .should('be.enabled')
      .focus()
      .type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    cy.get('app-payment-request-profile-settings [data-id="username-input"]').type('My Username');
    cy.get('app-payment-request-profile-settings [data-id="submit-button"]').click();

    // Complete description
    cy.get('app-payment-request-price-settings').contains('A connected wallet is required for conversion rates');
    cy.get('app-payment-request-price-settings [data-id="submit-button"]').click();
  });
});
