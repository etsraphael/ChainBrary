/// <reference types="cypress" />

import '@angular/compiler';
import { IPaymentRequestRaw } from '../../../../src/app/shared/interfaces';

class MockPaymentService {
  removeEmptyStringProperties<T>(obj: T): T {
    const result = { ...obj };
    for (const key in result) {
      if (typeof result[key] === 'string' && result[key] === '') {
        delete result[key];
      }
    }
    return result;
  }
}

describe('Check native payment generated', () => {
  const formatService = new MockPaymentService();

  const paymentRequest: IPaymentRequestRaw = {
    publicAddress: '0xbA3Fc0648186a79baEF8DCeE9e055873F432a351',
    name: 'John Doe'
  };

  const paymentRequestBase64: string = Buffer.from(
    JSON.stringify(formatService.removeEmptyStringProperties(paymentRequest)),
    'utf-8'
  )
    .toString('base64')
    .replace('+', '-')
    .replace('/', '_');

  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/pay-now/${paymentRequestBase64}`);
  });

  it('Generate payment without wallet', () => {
    cy.get('[data-id=pn-header-container] h3').should('have.text', paymentRequest.name);
    cy.get('[data-id=pn-header-container] p').should('contain', paymentRequest.publicAddress.slice(-4));
  });

  it('Select random token', () => {
    // Select 5 times a random token
    for (let i = 0; i < 5; i++) {
      cy.get('mat-select[formControlName="tokenId"]').click();

      // Select a random token
      cy.get('mat-option').then(($options) => {
        const randomIndex = Math.floor(Math.random() * $options.length);
        cy.wrap($options[randomIndex]).click();
      });

      // Verify the selection by checking the value of the selected option
      cy.get('mat-select[formControlName="tokenId"]')
        .invoke('text')
        .then((selectedText) => {
          expect(selectedText.trim()).to.not.be.empty;
        });

      cy.get('[data-id=pw-conversion-result]').within(() => {
        cy.get('h6').should('have.class', 'text-light').and('not.be.empty');
      });
    }
  });
});
