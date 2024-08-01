import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NetworkChainId } from '@chainbrary/web3-login';

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

  generateScanLink(chainId: NetworkChainId, txn: string): string | null {
    switch (chainId) {
      case NetworkChainId.LOCALHOST:
      case NetworkChainId.ETHEREUM:
        return `https://etherscan.io/tx/${txn}`;
      case NetworkChainId.SEPOLIA:
        return `https://sepolia.etherscan.io/tx/${txn}`;
      case NetworkChainId.POLYGON:
        return `https://polygonscan.com/tx/${txn}`;
      case NetworkChainId.BNB:
        return `https://bscscan.com/tx/${txn}`;
      case NetworkChainId.AVALANCHE:
        return `https://snowtrace.io/tx/${txn}`;
      case NetworkChainId.FANTOM:
        return `https://ftmscan.com/tx/${txn}`;
      default:
        return null;
    }
  }

  getIconUrl(chainId: NetworkChainId): string {
    const blobUrl = 'https://chainbraryfrontendassets.blob.core.windows.net/tokens/';
    switch (chainId) {
      case NetworkChainId.LOCALHOST:
      case NetworkChainId.ETHEREUM:
        return blobUrl + 'eth-icon.svg';
      case NetworkChainId.SEPOLIA:
        return blobUrl + 'eth-icon.svg';
      case NetworkChainId.POLYGON:
        return blobUrl + 'matic-icon.svg';
      case NetworkChainId.BNB:
        return blobUrl + 'bnb-icon.svg';
      case NetworkChainId.AVALANCHE:
        return blobUrl + 'avax-icon.svg';
      case NetworkChainId.FANTOM:
        return blobUrl + 'ftm-icon.svg';
      default:
        return 'not-found.svg';
    }
  }

  ethAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (!value) return null;

      const isHex = /^0x[a-fA-F0-9]{40}$/.test(value);
      return isHex ? null : { invalidAddress: true };
    };
  }
}
