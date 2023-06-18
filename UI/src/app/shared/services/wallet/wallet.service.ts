import { Injectable } from '@angular/core';
import { Web3LoginService } from '@chainbrary/web3-login';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private web3LoginService: Web3LoginService) {}

  curentChainIdIsMatching(currentChainId: string): boolean {
    const currentNetwork = this.web3LoginService.getCurrentNetwork();
    if (currentNetwork && currentNetwork.chainId === currentChainId) {
      return true;
    }
    return false;
  }
}
