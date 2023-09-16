/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('Go on activity page', () => {
  beforeEach(() => {
    cy.login('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '...', NetworkChainId.ETHEREUM);
  });

  it('Go on activity page started', () => {
    // Complete profile information
    cy.get('#btn-use-case-bi-clipboard-data-fill').click();
  });
});
