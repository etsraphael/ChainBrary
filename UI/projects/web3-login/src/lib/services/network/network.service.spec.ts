import { TestBed } from '@angular/core/testing';
import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { NetworkServiceWeb3Login } from './network.service';

describe('NetworkServiceWeb3Login', () => {
  let service: NetworkServiceWeb3Login;

  const web3LoginConfig: Web3LoginConfig = {
    networkSupported: [
      {
        chainId: NetworkChainId.ETHEREUM,
        rpcUrl: ['https://ethereum.publicnode.com']
      },
      {
        chainId: NetworkChainId.SEPOLIA,
        rpcUrl: ['https://rpc.sepolia.org']
      },
      {
        chainId: NetworkChainId.POLYGON,
        rpcUrl: ['https://polygon-rpc.com']
      },
      {
        chainId: NetworkChainId.BNB,
        rpcUrl: ['https://bsc-dataseed.binance.org']
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        rpcUrl: ['https://api.avax.network/ext/bc/C/rpc']
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkServiceWeb3Login, { provide: 'config', useValue: web3LoginConfig }]
    });
    service = TestBed.inject(NetworkServiceWeb3Login);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
