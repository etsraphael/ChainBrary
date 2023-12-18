import { Component } from '@angular/core';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { environment } from './../../../../../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-document-locker-form',
  templateUrl: './document-locker-form.component.html',
  styleUrls: ['./document-locker-form.component.scss']
})
export class DocumentLockerFormComponent {
  networkSupported: NetworkChainId[] = environment.contracts.documentLocker.networkSupported;

  constructor(public web3LoginService: Web3LoginService) {}

  networkList: INetworkDetail[] = this.networkSupported.map((chainId: NetworkChainId) =>
    this.web3LoginService.getNetworkDetailByChainId(chainId)
  );

  mainForm = new FormGroup<DocumentLockingForm>({
    documentName: new FormControl<string | null>(null, [Validators.required]),
    ownerName: new FormControl<string | null>(null, [Validators.required]),
    desc: new FormControl<string | null>(null, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required]),
    termsAndCond: new FormControl<boolean | null>(null, [Validators.requiredTrue]),
    networkChainId: new FormControl<NetworkChainId | null>(null, [Validators.required])
  });

  submitForm(): void {
    this.mainForm.markAllAsTouched();

    const formValue = this.mainForm.value;

    console.log(formValue);

    if (this.mainForm.invalid) {
      return;
    }

    alert('sent');
  }
}
export interface DocumentLockingForm {
  documentName: FormControl<string | null>;
  ownerName: FormControl<string | null>;
  desc: FormControl<string | null>;
  price: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
  networkChainId: FormControl<NetworkChainId | null>;
}
