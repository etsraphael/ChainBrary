describe('Landing page', () => {
  // beforeEach(() => {
  //   cy.visit('http://localhost:4200');
  // });

  it('.type() - type into a DOM element', () => {
    cy.visit(`${Cypress.env('baseUrl')}/`);

    cy.get('.row.container-title').find('h1.text-dark').should('have.text', 'We trust the code, not people.');
  });
});
