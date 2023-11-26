/// <reference types="cypress" />

import '@angular/compiler';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('Create a bid without a wallet', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.login('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '...', NetworkChainId.ETHEREUM);
    cy.visit(`${Cypress.env('baseUrl')}/use-cases/bid`);
  });

  it('Complete the form', () => {
    // Go to the page
    cy.get('app-home-bid-menu a[ng-reflect-router-link="/use-cases/bid/creation"]').click();

    // Complete the form
    cy.get('[formControlName="bidName"]').type('House in Paris');
    cy.get('[formControlName="ownerName"]').type('House Agency 007');
    cy.get('[formControlName="description"]').type('This is my house description');
    cy.get('[formControlName="duration"]').focus().type('30');

    // click on the creation button
    cy.get('app-bid-creation [data-id="start-bid-btn"]').click();

    // check error message for terms and conditions
    cy.get('app-bid-creation').contains('You must accept the terms and conditions').should('be.visible');

    // Accept terms and conditions
    cy.get('[formControlName="termsAndCond"]').click();

    // Check snackbar message
    cy.get('app-bid-creation [data-id="start-bid-btn"]').click();
    cy.get('mat-snack-bar-container simple-snack-bar .mat-mdc-snack-bar-label')
      .should('be.visible')
      .contains('Please add at least one image');

    // Add images
    cy.get('app-bid-creation .upload-image-carousel').click();
    cy.get('app-upload-img-modal [formControlName="url"]').type(
      'https://images.unsplash.com/photo-1700740760502-f28b1769c8d3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    );
    cy.get('app-upload-img-modal [data-id="add-image"]').click();
  });
});
