/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';
import { injectMetaMaskStub } from '../../injectors/metamask-stub';

describe('Log an user without Metamask', () => {
  it('Start login without Metamask', () => {
    // Go to explore solutions page
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Click on login button
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/payment-request`);
    cy.get('app-payment-request-profile-settings [data-id="login-btn"]').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn-metamask"]').click();

    // Check snackbar message
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('mat-snack-bar-container simple-snack-bar .mat-mdc-snack-bar-label')
      .should('be.visible')
      .contains('Non-Ethereum browser detected');
  });
});

describe('Log an user with MetaMask', () => {
  it('Log an User With MetaMask Started', () => {
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...';

    // Inject MetaMask
    injectMetaMaskStub(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.POLYGON);

    // Go to explore solutions page
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Click on login button
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/payment-request`);
    cy.get('app-payment-request-profile-settings [data-id="login-btn"]').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn-metamask"]').click();

    // check is address is visible
    cy.get('app-auth-banner [data-id="address-id"]').scrollIntoView().should('be.visible');

    cy.window().its('ethereum.isMetaMask').should('be.true');
  });
});
