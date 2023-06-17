import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor() {}

  curentChainIdIsMatching(currentChainId: string): boolean {
    return false;
  }
}
