import { Injectable } from '@angular/core';

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

  savechainId(chainId: string): void {
    return localStorage.setItem('chainId', chainId);
  }

  getchainId(): string | null {
    return localStorage.getItem('chainId');
  }

  removechainId(): void {
    return localStorage.removeItem('chainId');
  }
}
