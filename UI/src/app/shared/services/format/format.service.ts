import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  formatPublicAddress(address: string): string {
    return `${address.slice(0, 15)}...${address.slice(-15)}`;
  }

  timeStampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  removeScientificNotation(num: number): string {
    // Find the exponent value after 'e'
    const expMatch = num.toString().match(/e([-+]?\d+)/);
    const exp = expMatch ? parseInt(expMatch[1], 10) : 0;

    // Calculate the number of decimal places needed
    const decimalPlaces = exp < 0 ? Math.abs(exp) + 1 : 0;

    // Convert the number to a fixed decimal representation
    const fixedNumber = num.toFixed(decimalPlaces);

    return fixedNumber;
  }
}
