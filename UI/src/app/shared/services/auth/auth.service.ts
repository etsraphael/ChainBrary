import { Injectable } from '@angular/core';
import { NetworkChainId } from '@chainbrary/web3-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  savePublicAddress(publicAddress: string): void {
    return localStorage.setItem('publicAddress', publicAddress);
  }

  getPublicAddress(): string | null {
    return localStorage.getItem('publicAddress');
  }

  removePublicAddress(): void {
    return localStorage.removeItem('publicAddress');
  }

  savechainId(chainId: NetworkChainId): void {
    return localStorage.setItem('chainId', chainId);
  }

  getchainId(): string | null {
    return localStorage.getItem('chainId');
  }

  removechainId(): void {
    return localStorage.removeItem('chainId');
  }

  saveRecentWallet(recentWallet: string): void {
    return localStorage.setItem('recentWallet', recentWallet);
  }

  getRecentWallet(): string | null {
    return localStorage.getItem('recentWallet');
  }

  removeRecentWallet(): void {
    return localStorage.removeItem('recentWallet');
  }
}
