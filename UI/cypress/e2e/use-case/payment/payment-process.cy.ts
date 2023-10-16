/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { IPaymentRequest } from '../../../../src/app/shared/interfaces';
import { injectMetaMaskStub } from '../../../injectors/metamask-stub';
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
  beforeEach(() => {
    cy.viewport('iphone-x');
    const WALLET_ADDRESS = '0xb22bde4519854326622b64f67c84d64d189772d4';
    const SIGNED_MESSAGE = '...';

    // Inject MetaMask
    injectMetaMaskStub(WALLET_ADDRESS, SIGNED_MESSAGE, NetworkChainId.LOCALHOST);
    cy.visit(`${Cypress.env('baseUrl')}/payment-page/${paymentRequestBase64}`);
  });

  const formatService = new MockPaymentService();

  const paymentRequest: IPaymentRequest = {
    chainId: NetworkChainId.LOCALHOST,
    tokenId: TokenId.ETHEREUM,
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

  it('Process a payment', () => {
    cy.get('app-payment-request-card [data-id="login-btn"]').should('be.visible').click();
    cy.get('lib-web3-login lib-card-body-login [data-id="wallet-container-btn"]').click();
    cy.get('app-payment-request-card [data-id="login-btn"]').should('not.exist');
    cy.wait(2000);
    cy.get('app-payment-request-card [data-id="btn-confirm-transaction"]').should('be.visible').click();
  });
});
