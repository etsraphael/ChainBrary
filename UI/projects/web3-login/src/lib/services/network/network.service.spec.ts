import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { NetworkServiceWeb3Login } from './network.service';
import { Web3LoginConfig } from '@chainbrary/web3-login';

describe('NetworkServiceWeb3Login', () => {
  let networkServiceWeb3Login: NetworkServiceWeb3Login;
  let config: Web3LoginConfig;

  beforeEach(() => {
    config = {} as Web3LoginConfig;
    networkServiceWeb3Login = new NetworkServiceWeb3Login(config);
  });

  it('should be created', () => {
    expect(networkServiceWeb3Login).toBeTruthy();
  });
});
