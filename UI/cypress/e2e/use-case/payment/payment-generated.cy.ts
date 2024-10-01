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
    name: 'John Doe',
    publicAddress: '0xd288b9f2028cea98f3132b700fa45c95023eca24',
    amount: 1,
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
    cy.viewport('iphone-x');
  });

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/pay-now/${paymentRequestBase64}`);
    cy.get('[data-id=pn-header-container] h3').should('have.text', paymentRequest.name);
    cy.get('[data-id=action-btn]').should('have.text', 'Connect Wallet');
    cy.get('[data-id=payment-type-container]').contains('Amount (in SEP)');
  });

  it('Generate payment with wallet and wrong network', () => {
    // before
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...';
    cy.login(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.POLYGON);
    cy.visit(`${Cypress.env('baseUrl')}/pay-now/${paymentRequestBase64}`);

    // test
    cy.get('[data-id=action-btn]').should('have.text', 'Pay Now');
    cy.get('[data-id=action-btn]').click();
  });
});

describe('Check native payment generated with USD enabled', () => {
  const formatService = new MockPaymentService();

  const paymentRequest: IPaymentRequest = {
    chainId: NetworkChainId.POLYGON,
    tokenId: TokenId.ETHEREUM,
    name: 'John Doe',
    publicAddress: '0xd288b9f2028cea98f3132b700fa45c95023eca24',
    amount: 1000,
    usdEnabled: true
  };

  const paymentRequestBase64: string = Buffer.from(
    JSON.stringify(formatService.removeEmptyStringProperties(paymentRequest)),
    'utf-8'
  )
    .toString('base64')
    .replace('+', '-')
    .replace('/', '_');

  beforeEach(() => {
    cy.viewport('iphone-x');
  });

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/pay-now/${paymentRequestBase64}`);
    cy.get('[data-id=pn-header-container] h3').should('have.text', paymentRequest.name);
    cy.get('[data-id=payment-type-container]').contains('Amount (in USD)');
    cy.get('[data-id=action-btn]').should('have.text', 'Connect Wallet');
  });
});

describe('Check non-native payment generated', () => {
  const formatService = new MockPaymentService();

  const paymentRequest: IPaymentRequest = {
    chainId: NetworkChainId.POLYGON,
    tokenId: 'chainlink',
    name: 'John Doe',
    publicAddress: '0xd288b9f2028cea98f3132b700fa45c95023eca24',
    amount: 1,
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
    cy.viewport('iphone-x');
  });

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/pay-now/${paymentRequestBase64}`);

    cy.get('[data-id=pn-header-container] h3').should('have.text', paymentRequest.name);
    cy.get('[data-id=action-btn]').should('have.text', 'Connect Wallet');
    cy.get('[data-id=payment-type-container]').contains('Amount (in LINK)');
  });
});
