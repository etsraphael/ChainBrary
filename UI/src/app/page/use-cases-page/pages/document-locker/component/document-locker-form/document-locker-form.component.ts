import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Observable, ReplaySubject, distinctUntilChanged, filter, map, takeUntil, withLatestFrom } from 'rxjs';
import { environment } from './../../../../../../../environments/environment';

@Component({
  selector: 'app-document-locker-form[currentNetworkObs]',
  templateUrl: './document-locker-form.component.html',
  styleUrls: ['./document-locker-form.component.scss']
})
export class DocumentLockerFormComponent implements OnInit, OnDestroy {
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
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

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  ngOnInit(): void {
    this.setUpForm();
  }

  setUpForm(): void {
    this.mainForm
      .get('networkChainId')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        withLatestFrom(this.currentNetworkObs),
        takeUntil(this.destroyed$),
        filter(([chainId]: [NetworkChainId | null, INetworkDetail | null]) => chainId !== null),
        map((payload) => payload as [NetworkChainId, INetworkDetail | null])
      )
      .subscribe(([chainId, network]: [NetworkChainId, INetworkDetail | null]) => {
        // reset error
        this.mainForm.get('networkChainId')?.clearValidators();
        this.mainForm.get('networkChainId')?.setValidators([Validators.required]);
        this.mainForm.get('networkChainId')?.updateValueAndValidity();

        if (chainId !== network?.chainId) {
          this.mainForm.get('networkChainId')?.setErrors({ notMatching: true });
        }

        if (!this.networkSupported.includes(chainId)) {
          this.mainForm.get('networkChainId')?.setErrors({ notSupported: true });
        }
      });
  }

  submitForm(): void {
    this.mainForm.markAllAsTouched();

    const formValue = this.mainForm.value;

    console.log(formValue);

    if (this.mainForm.invalid) {
      return;
    }

    alert('sent');
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
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
