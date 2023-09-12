type EthereumRequest = {
  method: string;
};

type CallbackFunction = (event: string) => void;

type EthereumStub = {
  isMetaMask: boolean;
  chainId: string;
  request: (request: EthereumRequest) => Promise<string[] | string>;
  on: (event: string, callback: CallbackFunction) => void;
  addListener: (event: string, callback: CallbackFunction) => void;
  removeListener: (event: string, callback: CallbackFunction) => void;
};

export const injectMetaMaskStub = (WALLET_ADDRESS: string, SIGNED_MESSAGE: string) => {
  const eventListeners: { [event: string]: CallbackFunction[] } = {};

  const determineStubResponse = (request: EthereumRequest): string[] | string => {
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

  cy.on('window:before:load', (win: Window & typeof globalThis & { ethereum?: EthereumStub }) => {
    win.ethereum = {
      isMetaMask: true,
      chainId: '0x1',
      networkVersion: '1',

      request: async (request: EthereumRequest) => determineStubResponse(request),
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
};
