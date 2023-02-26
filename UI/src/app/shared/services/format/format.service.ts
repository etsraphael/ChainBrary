import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  formatPublicAddress(address: string): string {
    return `${address.slice(0, 15)}...${address.slice(-15)}`;
  }
}
