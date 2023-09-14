/// <reference types="cypress" />

import '@angular/compiler';

describe('Check payment generated', () => {
  it('Generate payment started', () => {
    cy.visit(
      `${Cypress.env(
        'baseUrl'
      )}/payment-page/eyJjaGFpbklkIjoiMSIsInRva2VuSWQiOiJjaGFpbmxpbmsiLCJ1c2VybmFtZSI6InF3ZSIsInB1YmxpY0FkZHJlc3MiOiIweGJhM2ZjMDY0ODE4NmE3OWJhZWY4ZGNlZTllMDU1ODczZjQzMmEzNTEiLCJhbW91bnQiOjIsInVzZEVuYWJsZWQiOmZhbHNlfQ%3D%3D`
    );
  });
});
