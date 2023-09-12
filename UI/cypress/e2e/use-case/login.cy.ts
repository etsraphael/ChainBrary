/// <reference types="cypress" />

describe('Log an User', () => {
  it('Start login without Metamask', () => {
    // Go to explore solutions page
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Click on login button
    cy.get('app-use-cases-sidebar-header [data-id="login-btn"]').click();
    cy.get('lib-web3-login lib-body [data-id="wallet-container-btn"]').click();

    // Check snackbar message
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('mat-snack-bar-container simple-snack-bar .mat-mdc-snack-bar-label')
      .should('be.visible')
      .contains('Non-Ethereum browser detected');
  });
});

describe('Log an User With MetaMask', () => {
  it('Log an User With MetaMask Started', () => {
    const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const SIGNED_MESSAGE = '...'; // your signed message
    const eventListeners = {};

    const determineStubResponse = (request) => {
      switch (request.method) {
        case 'eth_accounts':
        case 'eth_requestAccounts':
          return [WALLET_ADDRESS];
        case 'personal_sign':
          return SIGNED_MESSAGE;
        default:
          throw Error(`Unknown request: ${request.method}`);
      }
    };

    // Inject MetaMask
    cy.on('window:before:load', (win) => {
      win.ethereum = {
        isMetaMask: true,
        chainId: '0x1',

        request: async (request: { method: string }) => {
          return determineStubResponse(request);
        },

        on: (event, callback) => {
          if (!eventListeners[event]) {
            eventListeners[event] = [];
          }
          eventListeners[event].push(callback);
        },

        addListener: (event, callback) => {
          if (!eventListeners[event]) {
            eventListeners[event] = [];
          }
          eventListeners[event].push(callback);
        },

        removeListener: (event, callback) => {
          if (eventListeners[event]) {
            const index = eventListeners[event].indexOf(callback);
            if (index > -1) {
              eventListeners[event].splice(index, 1);
            }
          }
        }
      };
    });

    // Go to explore solutions page
    cy.visit(`${Cypress.env('baseUrl')}/`);
    cy.get('[data-id="explore-solutions"]').click();

    // Click on login button
    cy.get('app-use-cases-sidebar-header [data-id="login-btn"]').click();
    cy.get('lib-web3-login lib-body [data-id="wallet-container-btn"]').click();

    // check is address is visible
    cy.get('app-use-cases-sidebar-header [data-id="address-id"]').should('be.visible');

    cy.window().its('ethereum.isMetaMask').should('be.true');
  });
});
