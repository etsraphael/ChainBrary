/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { IPaymentRequest, IPaymentRequestRaw } from '../../../../src/app/shared/interfaces';

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

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/pay-now/${paymentRequestBase64}`);
    cy.get('[data-id=pn-header-container] h3').should('have.text', paymentRequest.name);
    cy.get('[data-id=pn-header-container] p').should('contain', paymentRequest.publicAddress.slice(-4));
  });
});
