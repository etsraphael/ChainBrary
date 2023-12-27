import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { INetworkDetail, NetworkChainId, Web3LoginService } from '@chainbrary/web3-login';
import { Observable, ReplaySubject, distinctUntilChanged, filter, map, takeUntil, withLatestFrom } from 'rxjs';
import { environment } from './../../../../../../../environments/environment';
import { TermAndCondModalComponent } from './../../../../../../shared/components/term-and-cond-modal/term-and-cond-modal.component';
import { documentLockerTermAndCond } from './../../../../../../shared/data/termAndCond';
import { DocumentLockingForm, IDocumentLockerCreation } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-document-locker-form[currentNetworkObs][errorMessage]',
  templateUrl: './document-locker-form.component.html',
  styleUrls: ['./document-locker-form.component.scss']
})
export class DocumentLockerFormComponent implements OnInit, OnDestroy {
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
  @Input() errorMessage: string | null;
  @Output() submitDocumentForm = new EventEmitter<IDocumentLockerCreation>();
  networkSupported: NetworkChainId[] = environment.contracts.documentLocker.networkSupported;

  constructor(
    public web3LoginService: Web3LoginService,
    private dialog: MatDialog
  ) {}

  networkList: INetworkDetail[] = this.networkSupported.map((chainId: NetworkChainId) =>
    this.web3LoginService.getNetworkDetailByChainId(chainId)
  );

  get tokenSelected(): string | null {
    return this.mainForm.get('networkChainId')?.value
      ? this.web3LoginService.getNetworkDetailByChainId(this.mainForm.get('networkChainId')?.value as NetworkChainId)
          .nativeCurrency.symbol
      : null;
  }

  mainForm = new FormGroup<DocumentLockingForm>({
    documentName: new FormControl<string | null>(null, [Validators.required]),
    ownerName: new FormControl<string | null>(null, [Validators.required]),
    desc: new FormControl<string | null>(null, [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
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

    if (this.mainForm.invalid) {
      return;
    }

    const { documentName, ownerName, desc, price, networkChainId } = this.mainForm.value as IDocumentLockerCreation;

    return this.submitDocumentForm.emit({
      documentName,
      ownerName,
      desc,
      price,
      networkChainId
    });
  }

  openTermAndCond(event: MouseEvent): MatDialogRef<TermAndCondModalComponent> {
    event.preventDefault();

    return this.dialog.open(TermAndCondModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-8'],
      data: documentLockerTermAndCond,
      autoFocus: false
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
