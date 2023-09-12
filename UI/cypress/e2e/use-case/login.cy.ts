/// <reference types="cypress" />

import { injectMetaMaskStub } from '../../injectors/metamask-stub';

describe('Log an User', () => {
  it('Start login without Metamask', () => {
    // Go to explore solutions page
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Click on login button
    cy.get('app-use-cases-sidebar-header [data-id="login-btn"]').click();
    cy.get('lib-web3-login lib-body [data-id="wallet-container-btn"]').click();

    // Check snackbar message
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('mat-snack-bar-container simple-snack-bar .mat-mdc-snack-bar-label')
      .should('be.visible')
      .contains('Non-Ethereum browser detected');
  });
});

describe('Log an User With MetaMask', () => {
  it('Log an User With MetaMask Started', () => {
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...';

    // Inject MetaMask
    injectMetaMaskStub(WALLET_ADDRESS, SIGNED_MESSAGE);

    // Go to explore solutions page
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Click on login button
    cy.get('app-use-cases-sidebar-header [data-id="login-btn"]').click();
    cy.get('lib-web3-login lib-body [data-id="wallet-container-btn"]').click();

    // check is address is visible
    cy.get('app-use-cases-sidebar-header [data-id="address-id"]').should('be.visible');

    cy.window().its('ethereum.isMetaMask').should('be.true');
  });
});
