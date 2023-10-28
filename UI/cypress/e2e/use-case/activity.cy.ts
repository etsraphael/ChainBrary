/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('Go on activity page with a wallet', () => {
  beforeEach(() => {
    cy.login('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '...', NetworkChainId.ETHEREUM);
  });

  it('Go on activity page started', () => {
    // Complete profile information
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/activity`);
    cy.get('app-transaction-activity-table [data-id="login-btn"]').click();
  });
});

describe('Go on activity page without a wallet', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/activity`);
  });

  it('Go on activity page started', () => {
    // Complete profile information
    cy.get('app-transaction-activity-table').contains('Wallet is not connected');
  });
});
