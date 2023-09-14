/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('Create a payment request', () => {
  beforeEach(() => {
    cy.login('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '...', NetworkChainId.ETHEREUM);
  });

  it('Start payment', () => {
    // Complete profile information
    cy.get('app-payment-request-profile-settings [data-id="address-input"]').type(
      '0xbA3Fc0648186a79baEF8DCeE9e055873F432a351',
      { force: true }
    );
    cy.get('app-payment-request-profile-settings [data-id="username-input"]').type('My Username');
    cy.get('app-payment-request-profile-settings [data-id="submit-button"]').click();

    // Complete description
    cy.get('app-payment-request-price-settings [data-id="description-input"]').type(
      'This is my payment request description',
      { force: true }
    );
  });
});
