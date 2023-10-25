/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';
import { injectMetaMaskStub } from '../injectors/metamask-stub';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('login', (walletAddress: string, signedMessage: string, networkId: NetworkChainId) => {
  // Inject MetaMask
  injectMetaMaskStub(walletAddress, signedMessage, networkId);

  cy.visit(`${Cypress.env('baseUrl')}/`);
  cy.get('[data-id="explore-solutions"]').click();

  // Click on login button
  cy.visit(`${Cypress.env('baseUrl')}/use-cases/payment-request`);
  cy.get('app-payment-request-profile-settings [data-id="login-btn"]').click();
  cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn-metamask"]').click();
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string, networkId: NetworkChainId): Chainable<void>;
    }
  }
}
