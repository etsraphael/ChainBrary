/// <reference types="cypress" />

describe('Metamask Injection', () => {
  it('MetaMask injection started', () => {
    cy.on('window:before:load', (win) => {
      win.ethereum = {
        isMetaMask: true,
        chainId: '0x1'
      };
    });

    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.window().its('ethereum.isMetaMask').should('be.true');
  });
});
