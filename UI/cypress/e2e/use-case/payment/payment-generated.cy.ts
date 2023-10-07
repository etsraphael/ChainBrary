/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { injectMetaMaskStub } from '../../../injectors/metamask-stub';
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

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);
    cy.get('[data-id=recipient-username-id]').should('have.text', paymentRequest.username);
    cy.get('[data-id=recipient-description-id]').contains(paymentRequest.description);
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible');
  });

  it('Generate payment with wallet and wrong network', () => {
    // before
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...';
    cy.login(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.ETHEREUM);
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);

    // test
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn"]').click();
    cy.get('app-payment-page [data-id="wrong-network-alert"]').should('be.visible').contains('Wrong network');
  });

  it('Generate payment with wallet and right network', () => {
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...';

    // Inject MetaMask
    cy.login(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.SEPOLIA);
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);

    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn"]').click();
    cy.get('app-payment-request-card [data-id="login-btn"]').should('not.exist');

    cy.get('app-payment-request-card [data-id="btn-confirm-transaction"]').should('be.visible');

    cy.get('app-payment-request-card [data-id="btn-confirm-transaction"]')
      .find('button[type="submit"]')
      .should('not.have.attr', 'disabled');
  });

  it('Generate payment receiver of the transaction', () => {
    const WALLET_ADDRESS = paymentRequest.publicAddress;
    const SIGNED_MESSAGE = '...';

    // Inject MetaMask
    cy.login(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.SEPOLIA);
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn"]').click();

    cy.get('app-payment-page [data-id="warning-banner"]')
      .should('be.visible')
      .contains('Attention: This is a preview of your request. Avoid the mistake of self-payment.');
  });
});

describe('Check native payment generated with USD enabled', () => {
  const formatService = new MockPaymentService();

  const paymentRequest: IPaymentRequest = {
    chainId: NetworkChainId.ETHEREUM,
    tokenId: TokenId.ETHEREUM,
    username: 'John Doe',
    publicAddress: '0xd288b9f2028cea98f3132b700fa45c95023eca24',
    amount: 1000,
    description: 'A simple transaction',
    avatarUrl: '',
    usdEnabled: true
  };

  const paymentRequestBase64: string = Buffer.from(
    JSON.stringify(formatService.removeEmptyStringProperties(paymentRequest)),
    'utf-8'
  )
    .toString('base64')
    .replace('+', '-')
    .replace('/', '_');

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);
    cy.get('[data-id=recipient-username-id]').should('have.text', paymentRequest.username);
    cy.get('[data-id=recipient-description-id]').contains(paymentRequest.description);
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible');

    cy.get('[data-id=mathing-amount-message]').contains(
      `${paymentRequest.username} is requesting a sum equivalent to $${paymentRequest.amount} USD.`
    );
  });
});

describe('Check non-native payment generated', () => {
  const formatService = new MockPaymentService();

  const paymentRequest: IPaymentRequest = {
    chainId: NetworkChainId.ETHEREUM,
    tokenId: 'chainlink',
    username: 'John Doe',
    publicAddress: '0xd288b9f2028cea98f3132b700fa45c95023eca24',
    amount: 1,
    description: 'A simple transaction',
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

  it('Generate payment without wallet', () => {
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);
    cy.get('[data-id=recipient-username-id]').should('have.text', paymentRequest.username);
    cy.get('[data-id=recipient-description-id]').contains(paymentRequest.description);
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible');
  });

  it('Generate payment with wallet and right network', () => {
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...';

    // Inject MetaMask
    cy.login(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.ETHEREUM);
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);

    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn"]').click();
    cy.get('app-payment-request-card [data-id="login-btn"]').should('not.exist');

    cy.get('app-payment-request-card [data-id="btn-confirm-transaction"]').should('be.visible');

    cy.get('app-payment-request-card [data-id="btn-confirm-transaction"]')
      .find('button[type="submit"]')
      .should('have.attr', 'disabled');
  });
});
