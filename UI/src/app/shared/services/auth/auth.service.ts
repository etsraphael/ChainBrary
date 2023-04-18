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

  saveNetworkId(networkId: string): void {
    return localStorage.setItem('networkId', networkId);
  }

  getNetworkId(): string | null {
    return localStorage.getItem('networkId');
  }

  removeNetworkId(): void {
    return localStorage.removeItem('networkId');
  }
}
