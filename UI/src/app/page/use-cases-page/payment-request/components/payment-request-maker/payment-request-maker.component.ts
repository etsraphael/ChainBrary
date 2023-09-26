import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { INetworkDetail, NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { Action } from '@ngrx/store';
import { Buffer } from 'buffer';
import {
  Observable,
  ReplaySubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  take,
  takeUntil
} from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';
import {
  IConversionToken,
  IPaymentRequest,
  IToken,
  PaymentMakerForm,
  PriceSettingsForm,
  ProfileForm,
  StoreState,
  TokenChoiceMakerForm
} from './../../../../../shared/interfaces';
import { FormatService } from './../../../../../shared/services/format/format.service';

@Component({
  selector: 'app-payment-request-maker[publicAddressObs][currentNetworkObs]',
  templateUrl: './payment-request-maker.component.html',
  styleUrls: ['./payment-request-maker.component.scss']
})
export class PaymentRequestMakerComponent implements OnInit, OnDestroy {
  @Input() publicAddressObs: Observable<string | null>;
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
  @Input() paymentTokenObs: Observable<IToken | null>;
  @Input() paymentConversionObs: Observable<StoreState<IConversionToken>>;
  @Input() resetTransactionObs: Observable<Action>;
  @Output() setUpTokenChoice: EventEmitter<string> = new EventEmitter<string>();
  @Output() applyConversionToken: EventEmitter<number> = new EventEmitter<number>();
  @Output() switchToUsd: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('stepper') stepper: MatStepper;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  AuthStatusCodeTypes = AuthStatusCode;
  mainForm: FormGroup<PaymentMakerForm>;
  linkGenerated: string;
  isAvatarUrlValid: boolean;

  constructor(private formatService: FormatService) {}

  get priceForm(): FormGroup<PriceSettingsForm> {
    return this.mainForm.get('price') as FormGroup<PriceSettingsForm>;
  }

  get profileForm(): FormGroup<ProfileForm> {
    return this.mainForm.get('profile') as FormGroup<ProfileForm>;
  }

  get amount(): Observable<number> {
    if (this.priceForm?.get('usdEnabled')?.value as boolean) {
      return this.paymentConversionObs.pipe(map((x) => x.data.tokenAmount as number));
    } else {
      return of(this.priceForm.get('amount')?.value as number);
    }
  }

  get usdAmount(): Observable<number | null> {
    return this.paymentConversionObs.pipe(map((x) => x.data.usdAmount));
  }

  get avatarValue(): string | null {
    return this.profileControls.avatarUrl.value;
  }

  get profileControls(): ProfileForm {
    return this.mainForm.controls.profile.controls;
  }

  get priceControls(): PriceSettingsForm {
    return this.mainForm.controls.price.controls;
  }

  get tokenChoiceControls(): TokenChoiceMakerForm {
    return this.priceForm.controls.token.controls;
  }

  get tokenChoiceForm(): FormGroup<TokenChoiceMakerForm> {
    return this.priceForm.get('token') as FormGroup<TokenChoiceMakerForm>;
  }

  ngOnInit(): void {
    this.setUpForm();
    this.listenToAddressChange();
    this.listenToAmountChange();
    this.listenToTokenChange();
    this.listenToResetTransaction();
    this.listenNetworkChange();
    this.setDefaultTokenSelection();
  }

  listenToResetTransaction(): void {
    this.resetTransactionObs.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.stepper.selectedIndex = 0;
      this.priceForm.reset();
      this.setDefaultTokenSelection();
    });
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      price: new FormGroup({
        token: new FormGroup({
          tokenId: new FormControl('', [Validators.required]),
          chainId: new FormControl('', [Validators.required])
        }),
        description: new FormControl('', []),
        amount: new FormControl(1, [Validators.required, Validators.min(0)]),
        usdEnabled: new FormControl(false, [])
      }),
      profile: new FormGroup({
        publicAddress: new FormControl('', [Validators.required, this.ethAddressValidator()]),
        avatarUrl: new FormControl('', [], [this.urlValidator()]),
        username: new FormControl('', [Validators.required, Validators.maxLength(20)])
      })
    });
  }

  listenNetworkChange(): Subscription {
    return this.currentNetworkObs.pipe(takeUntil(this.destroyed$)).subscribe((currentNetwork: INetworkDetail | null) => {
      if (currentNetwork) {
        this.tokenChoiceForm.patchValue({
          chainId: currentNetwork.chainId,
          tokenId: currentNetwork.nativeCurrency.id
        });
      } else {
        this.tokenChoiceForm.patchValue({
          chainId: NetworkChainId.ETHEREUM,
          tokenId: TokenId.ETHEREUM
        });
      }
      this.priceForm.patchValue({
        amount: 1,
        usdEnabled: false
      });
    });
  }

  setDefaultTokenSelection(): void {
    this.currentNetworkObs.pipe(take(1)).subscribe((currentNetwork: INetworkDetail | null) => {
      if (currentNetwork) {
        this.tokenChoiceForm.patchValue({
          chainId: currentNetwork.chainId,
          tokenId: currentNetwork.nativeCurrency.id
        });
      } else {
        this.tokenChoiceForm.patchValue({
          chainId: NetworkChainId.ETHEREUM,
          tokenId: TokenId.ETHEREUM
        });
      }
      this.priceForm.patchValue({
        amount: 1,
        usdEnabled: false
      });
    });
  }

  listenToTokenChange(): void {
    this.priceForm
      .get('token.tokenId')
      ?.valueChanges.pipe(
        filter((tokenId: string | null) => tokenId !== null),
        map((tokenId: string | null) => tokenId as string),
        debounceTime(400),
        takeUntil(this.destroyed$)
      )
      .subscribe((tokenId: string) => {
        this.setUpTokenChoice.emit(tokenId);
        const usdEnabled: boolean = this.priceForm.get('usdEnabled')?.value as boolean;
        if (usdEnabled) this.swapCurrency();
      });
  }

  listenToAmountChange(): void {
    this.priceForm
      .get('amount')
      ?.valueChanges.pipe(
        startWith(this.priceForm.get('amount')?.value || 0),
        debounceTime(1000),
        filter((amount: number | null) => amount !== null && amount > 0),
        map((amount: number | null) => amount as number),
        takeUntil(this.destroyed$)
      )
      .subscribe((amount: number) => this.applyConversionToken.emit(amount as number));
  }

  listenToAddressChange(): void {
    this.publicAddressObs.pipe(takeUntil(this.destroyed$)).subscribe((publicAddress: string | null) => {
      if (publicAddress) this.profileForm.get('publicAddress')?.setValue(publicAddress);
      else this.profileForm.get('publicAddress')?.setValue('');
    });
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      this.generatePaymentRequest();
    }
  }

  generatePaymentRequest(): void {
    const { username, publicAddress, avatarUrl } = this.profileControls;
    const { amount, description, usdEnabled } = this.priceControls;
    const { tokenId, chainId } = this.tokenChoiceControls;

    const paymentRequest: IPaymentRequest = {
      chainId: chainId.value as NetworkChainId,
      tokenId: tokenId.value as string,
      username: username.value as string,
      publicAddress: publicAddress.value as string,
      amount: amount.value as number,
      description: description.value as string,
      avatarUrl: avatarUrl.value as string,
      usdEnabled: usdEnabled.value as boolean
    };

    const paymentRequestBase64: string = Buffer.from(
      JSON.stringify(this.formatService.removeEmptyStringProperties(paymentRequest)),
      'utf-8'
    )
      .toString('base64')
      .replace('+', '-')
      .replace('/', '_');
    const url: URL = new URL(window.location.href);
    const origin = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
    this.linkGenerated = `${origin}/payment-page/${paymentRequestBase64}`;
  }

  ethAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (!value) return null;

      const isHex = /^0x[a-fA-F0-9]{40}$/.test(value);
      return isHex ? null : { invalidAddress: true };
    };
  }

  urlValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      this.isAvatarUrlValid = false;

      const src: string = control.value;
      const img: HTMLImageElement = new Image();
      img.src = src;

      return new Observable((observer) => {
        img.onload = () => {
          this.isAvatarUrlValid = true;
          observer.next(null);
          observer.complete();
        };

        img.onerror = () => {
          this.isAvatarUrlValid = false;
          observer.next({ invalidUrl: true });
          observer.complete();
        };
      });
    };
  }

  swapCurrency(): void {
    this.switchToUsd.emit(!this.priceForm?.get('usdEnabled')?.value as boolean);

    this.paymentConversionObs.pipe(take(1)).subscribe((conversion: StoreState<IConversionToken>) => {
      if (!this.priceForm?.get('usdEnabled')?.value as boolean) {
        this.priceForm.patchValue({
          amount: conversion.data.usdAmount,
          usdEnabled: true
        });
      } else {
        this.priceForm.patchValue({
          amount: conversion.data.tokenAmount,
          usdEnabled: false
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
