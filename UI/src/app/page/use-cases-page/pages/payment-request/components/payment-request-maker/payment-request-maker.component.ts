import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
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
import { environment } from './../../../../../../../environments/environment';
import { AuthStatusCode } from './../../../../../../shared/enum';
import {
  IPaymentRequest,
  IToken,
  PaymentMakerForm,
  PriceSettingsForm,
  ProfileForm,
  TokenChoiceMakerForm
} from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { DataConversionStore } from './../../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-request-maker[publicAddressObs][currentNetworkObs]',
  templateUrl: './payment-request-maker.component.html',
  styleUrls: ['./payment-request-maker.component.scss']
})
export class PaymentRequestMakerComponent implements OnInit, OnDestroy {
  @Input() publicAddressObs: Observable<string | null>;
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
  @Input() paymentTokenObs: Observable<IToken | null>;
  @Input() paymentConversionObs: Observable<DataConversionStore>;
  @Input() resetTransactionObs: Observable<Action>;
  @Output() setUpTokenChoice: EventEmitter<string> = new EventEmitter<string>();
  @Output() applyConversionToken: EventEmitter<{ amount: number; amountInUsd: boolean }> = new EventEmitter<{
    amount: number;
    amountInUsd: boolean;
  }>();
  @ViewChild('stepper') stepper: MatStepper;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  AuthStatusCodeTypes = AuthStatusCode;
  mainForm = new FormGroup<PaymentMakerForm>({
    price: new FormGroup<PriceSettingsForm>({
      token: new FormGroup<TokenChoiceMakerForm>({
        tokenId: new FormControl(null, [Validators.required]),
        chainId: new FormControl(null, [Validators.required])
      }),
      description: new FormControl(null, []),
      amount: new FormControl(1, [Validators.required, Validators.min(0)]),
      amountInUsd: new FormControl(0, []),
      valueLockedInUsd: new FormControl(false, [])
    }),
    profile: new FormGroup<ProfileForm>({
      publicAddress: new FormControl(null, [Validators.required, this.formatService.ethAddressValidator()]),
      avatarUrl: new FormControl(null, [], [this.urlValidator()]),
      username: new FormControl(null, [Validators.required, Validators.maxLength(20)])
    })
  });
  linkGenerated: string;
  isAvatarUrlValid: boolean;

  constructor(
    private formatService: FormatService,
    private web3LoginService: Web3LoginService
  ) {}

  get currentNetworkIsNotSupported$(): Observable<boolean> {
    return this.currentNetworkObs.pipe(
      map((currentNetwork: INetworkDetail | null) =>
        currentNetwork
          ? !environment.contracts.bridgeTransfer.contracts.map((x) => x.chainId).includes(currentNetwork.chainId)
          : false
      )
    );
  }

  get priceForm(): FormGroup<PriceSettingsForm> {
    return this.mainForm.get('price') as FormGroup<PriceSettingsForm>;
  }

  get profileForm(): FormGroup<ProfileForm> {
    return this.mainForm.get('profile') as FormGroup<ProfileForm>;
  }

  get tokenAmount$(): Observable<number | null> {
    return this.paymentConversionObs.pipe(map((x) => x.conversionToken.data));
  }

  get usdAmount$(): Observable<number | null> {
    return this.paymentConversionObs.pipe(map((x) => x.conversionUSD.data));
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
    this.listenToAddressChange();
    this.listenToAmountChange();
    this.listenToTokenChange();
    this.listenToResetTransaction();
    this.listenNetworkChange();
    this.setDefaultTokenSelection();
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      this.generatePaymentRequest();
    }
  }

  generatePaymentRequest(): void {
    const { username, publicAddress, avatarUrl } = this.profileControls;
    const { amount, amountInUsd, description, valueLockedInUsd } = this.priceControls;
    const { tokenId, chainId } = this.tokenChoiceControls;
    const amountToReceive: number | null = valueLockedInUsd.value ? amountInUsd.value : amount.value;

    const paymentRequest: IPaymentRequest = {
      chainId: chainId.value as NetworkChainId,
      tokenId: tokenId.value as string,
      username: username.value as string,
      publicAddress: publicAddress.value as string,
      amount: amountToReceive as number,
      description: description.value as string,
      avatarUrl: avatarUrl.value as string,
      usdEnabled: valueLockedInUsd.value as boolean
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private listenToResetTransaction(): void {
    this.resetTransactionObs.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.stepper.selectedIndex = 0;
      this.priceForm.reset();
      this.setDefaultTokenSelection();
    });
  }

  private listenNetworkChange(): Subscription {
    return this.currentNetworkObs
      .pipe(takeUntil(this.destroyed$))
      .subscribe((currentNetwork: INetworkDetail | null) => {
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
          valueLockedInUsd: false
        });
      });
  }

  private setDefaultTokenSelection(): void {
    this.currentNetworkObs.pipe(take(1)).subscribe((currentNetwork: INetworkDetail | null) => {
      if (currentNetwork) {
        this.tokenChoiceForm.patchValue({
          chainId: currentNetwork.chainId,
          tokenId: currentNetwork.nativeCurrency.id
        });
      } else {
        const network: INetworkDetail = this.web3LoginService.getNetworkDetailByChainId(
          environment.contracts.bridgeTransfer.defaultNetwork
        );

        this.tokenChoiceForm.patchValue({
          chainId: network.chainId,
          tokenId: network.nativeCurrency.id
        });
      }
      this.priceForm.patchValue({
        amount: 1,
        valueLockedInUsd: false
      });
    });
  }

  private listenToTokenChange(): void {
    this.priceForm
      .get('token.tokenId')
      ?.valueChanges.pipe(
        filter((tokenId: string | null) => tokenId !== null),
        map((tokenId: string | null) => tokenId as string),
        debounceTime(400),
        takeUntil(this.destroyed$)
      )
      .subscribe((tokenId: string) => this.setUpTokenChoice.emit(tokenId));
  }

  private listenToAmountChange(): void {
    this.priceForm
      .get('amount')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(this.priceForm.get('amount')?.value || 0),
        debounceTime(1000),
        filter((amount: number | null) => amount !== null && amount > 0),
        map((amount: number | null) => amount as number),
        takeUntil(this.destroyed$)
      )
      .subscribe((amount: number) => this.applyConversionToken.emit({ amount, amountInUsd: false }));

    this.priceForm
      .get('amountInUsd')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(this.priceForm.get('amountInUsd')?.value || 0),
        debounceTime(1000),
        filter((amount: number | null) => amount !== null && amount > 0),
        map((amount: number | null) => amount as number),
        takeUntil(this.destroyed$)
      )
      .subscribe((amount: number) => this.applyConversionToken.emit({ amount, amountInUsd: true }));

    this.paymentConversionObs
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        takeUntil(this.destroyed$),
        filter((conversion: DataConversionStore) => conversion.conversionUSD.error !== 'NOT_SUPPORTED')
      )
      .subscribe((conversion: DataConversionStore) => {
        if (conversion.conversionToken.data !== null) {
          this.priceForm.patchValue(
            {
              amount: conversion.conversionToken.data,
              amountInUsd: conversion.conversionUSD.data
            },
            { emitEvent: false }
          );
        }

        if (conversion.conversionUSD.data !== null) {
          this.priceForm.patchValue(
            {
              amount: conversion.conversionToken.data,
              amountInUsd: conversion.conversionUSD.data
            },
            { emitEvent: false }
          );
        }
      });
  }

  private listenToAddressChange(): void {
    this.publicAddressObs.pipe(takeUntil(this.destroyed$)).subscribe((publicAddress: string | null) => {
      if (publicAddress) {
        this.profileForm.get('publicAddress')?.setValue(publicAddress);
        this.profileForm.get('publicAddress')?.disable();
      } else {
        this.profileForm.get('publicAddress')?.setValue('');
        this.profileForm.get('publicAddress')?.enable();
      }
    });
  }
}
