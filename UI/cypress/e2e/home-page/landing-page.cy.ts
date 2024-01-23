describe('Landing page', () => {
  it('.type() - type into a DOM element', () => {
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('.row.container-title').find('h1.text-dark').should('have.text', 'Trust, Secure, Safe: Committing to Reliability.');
  });
});
