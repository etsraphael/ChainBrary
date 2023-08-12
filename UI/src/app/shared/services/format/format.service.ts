import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  formatPublicAddress(address: string, range: number): string {
    return `${address.slice(0, range)}...${address.slice(range * -1)}`;
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

  removeEmptyStringProperties<T>(obj: T): T {
    const result = { ...obj };
    for (const key in result) {
      if (typeof result[key] === 'string' && result[key] === '') {
        delete result[key];
      }
    }
    return result;
  }
}
