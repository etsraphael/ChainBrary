/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('Create a document locker without a wallet', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.login('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '...', NetworkChainId.LOCALHOST);
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/document-locker`);
  });

  it('Complete the form', () => {
    // Go to the page
    cy.get('app-document-locker-menu a[ng-reflect-router-link="/use-cases/document-locker/cre"]').click();

    // Complete the form
    cy.get('[formControlName="documentName"]').focus().type('Confidential credentials');
    cy.get('[formControlName="ownerName"]').focus().type('Agent 007');

    // check wrong network
    cy.get('[formControlName="networkChainId"]').focus().click();
    cy.contains('mat-option[role="option"]', 'Polygon').click();
    cy.get('app-document-locker-form').contains('Network is not matching with wallet').should('be.visible');

    // Apply the right network
    cy.get('[formControlName="networkChainId"]').focus().click();
    cy.contains('mat-option[role="option"]', 'Localhost').click();

    cy.get('[formControlName="price"]').focus().type('30');

    // Check if description is required show error message
    cy.get('[formControlName="desc"]').focus();
    cy.get('app-document-locker-form').click();
    cy.get('app-document-locker-form').contains('Description is required').should('be.visible');
    cy.get('[formControlName="desc"]').focus().type('Loreum ipsum dolor sit amet, consectetur adipiscing elit.');

    // click on the creation button
    cy.get('app-document-locker-form [data-id="start-document-btn"]').click();

    // check error message for terms and conditions
    cy.get('app-document-locker-form').contains('You must accept the terms and conditions').should('be.visible');

    // Accept terms and conditions
    cy.get('[formControlName="termsAndCond"]').click();
  });
});
