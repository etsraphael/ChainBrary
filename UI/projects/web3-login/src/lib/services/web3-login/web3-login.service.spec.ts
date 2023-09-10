import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Web3LoginService } from './web3-login.service';
import { dialogMock } from '../../../../../../src/app/shared/tests/modules/modules.mock';
import { NetworkServiceWeb3Login } from '../network/network.service';
import { Web3LoginConfig } from '@chainbrary/web3-login';
import { ethereumNetworkMock } from '../../../../../../src/app/shared/tests/variables/network-detail';

describe('Web3LoginService', () => {
  let web3LoginService: Web3LoginService;
  let networkServiceWeb3Login: NetworkServiceWeb3Login;
  let config: Web3LoginConfig;

  beforeEach(() => {
    config = {} as Web3LoginConfig;
    networkServiceWeb3Login = new NetworkServiceWeb3Login(config);
    web3LoginService = new Web3LoginService(dialogMock, networkServiceWeb3Login);
  });

  it('should be created', () => {
    expect(web3LoginService).toBeTruthy();
  });

  it('should call getNetworkDetailByChainId', () => {
    const chainId = ethereumNetworkMock.chainId;
    const spyOnGetNetworkDetailByChainId = vi.spyOn(networkServiceWeb3Login, 'getNetworkDetailByChainId')
      .mockReturnValue(ethereumNetworkMock);

    web3LoginService.getNetworkDetailByChainId(chainId);

    expect(spyOnGetNetworkDetailByChainId).toHaveBeenCalled();
  });

  it('should call getNetworkDetailList', () => {
    const spyOnGetNetworkDetailList = vi.spyOn(networkServiceWeb3Login, 'getNetworkDetailList')
      .mockReturnValue([ethereumNetworkMock]);

    web3LoginService.getNetworkDetailList();

    expect(spyOnGetNetworkDetailList).toHaveBeenCalled();
  });
});
