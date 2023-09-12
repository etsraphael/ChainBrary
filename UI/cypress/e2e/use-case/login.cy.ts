/// <reference types="cypress" />

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
