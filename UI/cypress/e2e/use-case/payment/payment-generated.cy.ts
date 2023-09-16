/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { IPaymentRequest } from './../../../../src/app/shared/interfaces';

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

  const paymentRequest: IPaymentRequest = {
    chainId: NetworkChainId.SEPOLIA,
    tokenId: TokenId.SEPOLIA,
    username: 'John Doe',
    publicAddress: '0xd288b9f2028cea98f3132b700fa45c95023eca24',
    amount: 1,
    description: 'A simple description',
    avatarUrl: '',
    usdEnabled: false
  };

  const paymentRequestBase64: string = Buffer.from(
    JSON.stringify(formatService.removeEmptyStringProperties(paymentRequest)),
    'utf-8'
  )
    .toString('base64')
    .replace('+', '-')
    .replace('/', '_');

  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);
  });

  it('Generate payment without wallet without MetaMask', () => {
    cy.get('[data-id=recipient-username-id]').should('have.text', paymentRequest.username);
    cy.get('[data-id=recipient-description-id]').contains(paymentRequest.description);
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible');
  });
});
