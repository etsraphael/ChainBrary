/// <reference types="cypress" />

import '@angular/compiler';

describe('Create a QR code payment for shops', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}`);
    cy.get('[data-id="explore-solutions"]').click();
    cy.get('[data-id="btn-shop-qr-code"]').click();
    cy.get('[data-id="btn-print-qr-code"]').click();
  });

  it('Print a QR Code', () => {
    cy.get('[data-id="business-name"]').type('Test Business');
    cy.get('[data-id="owner-address"]').type('0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af');
    cy.get(`#shop-qr-code-visual-0`).click();

    cy.window().then((win) => {
      cy.stub(win, 'print').as('printStub');
    });

    // TODO: Fix this
    // Create a custom stub for window.open
    // let printWindow: Window;
    // cy.window().then((win: Cypress.AUTWindow) => {
    //   const originalOpen = win.open;
    //   cy.stub(win, 'open').callsFake((url, target, features) => {
    //     printWindow = originalOpen.call(win, url, target, features);
    //     cy.stub(printWindow.document, 'write').as('docWriteStub');
    //     return printWindow;
    //   }).as('openSpy');
    // });

    // // Trigger the print action
    // cy.get('[data-id="btn-print-qr-code"]').click();

    // // Assert that a new window was opened
    // cy.get('@openSpy').should('have.been.calledOnce');

    // // Ensure printWindow is defined
    // cy.window().then(() => {
    //   expect(printWindow).to.not.be.undefined;

    //   // Assert that the document.write method was called
    //   cy.get('@docWriteStub').should('have.been.calledOnce');

    // });
  });
});
