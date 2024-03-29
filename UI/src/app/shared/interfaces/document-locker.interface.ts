import { FormControl } from '@angular/forms';
import { NetworkChainId } from '@chainbrary/web3-login';

export interface DocumentLockingForm {
  documentName: FormControl<string | null>;
  ownerName: FormControl<string | null>;
  desc: FormControl<string | null>;
  price: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
  networkChainId: FormControl<NetworkChainId | null>;
}

export interface IDocumentLockerCreation {
  documentName: string;
  ownerName: string;
  desc: string;
  price: number;
  networkChainId: NetworkChainId;
}

export interface IDocumentLockerResponse {
  conctractAddress: string;
  documentName: string;
  ownerName: string;
  price: number;
  ownerAddress: string;
  accessAddress: string;
  desc?: string | null;
}

export enum DocumentLockerRole {
  OWNER,
  BUYER,
  NONE
}
