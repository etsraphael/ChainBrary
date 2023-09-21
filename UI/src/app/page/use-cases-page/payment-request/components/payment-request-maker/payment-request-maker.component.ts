import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Buffer } from 'buffer';
import {
  Observable,
  ReplaySubject,
  Subscription,
  combineLatest,
  debounceTime,
  filter,
  map,
  of,
  skip,
  startWith,
  take,
  takeUntil
} from 'rxjs';
import { FormatService } from './../../../../../shared/services/format/format.service';
import { AuthStatusCode } from './../../../../../shared/enum';
import {
  IConversionToken,
  IPaymentRequest,
  IToken,
  PaymentMakerForm,
  PriceSettingsForm,
  ProfileForm,
  StoreState
} from './../../../../../shared/interfaces';
import { WalletService } from './../../../../../shared/services/wallet/wallet.service';

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
  @Output() setUpTokenChoice: EventEmitter<string> = new EventEmitter<string>();
  @Output() applyConversionToken: EventEmitter<number> = new EventEmitter<number>();
  @Output() switchToUsd: EventEmitter<boolean> = new EventEmitter<boolean>();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  AuthStatusCodeTypes = AuthStatusCode;
  paymentMakePageTypes = PaymentMakePage;
  page: PaymentMakePage = PaymentMakePage.settingProfile;
  mainForm: FormGroup<PaymentMakerForm>;
  linkGenerated: string;
  isAvatarUrlValid: boolean;

  constructor(
    private snackbar: MatSnackBar,
    private walletService: WalletService,
    private formatService: FormatService
  ) {}

  get priceForm(): FormGroup<PriceSettingsForm> {
    return this.mainForm.get('price') as FormGroup<PriceSettingsForm>;
  }

  get profileForm(): FormGroup<ProfileForm> {
    return this.mainForm.get('profile') as FormGroup<ProfileForm>;
  }

  get amount(): Observable<number> {
    if (this.priceForm?.get('usdEnabled')?.value as boolean)
      return this.paymentConversionObs.pipe(map((x) => x.data.usdAmount as number));
    else return of(this.priceForm.get('amount')?.value as number);
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

  ngOnInit(): void {
    this.setUpForm();
    this.listenToAddressChange();
    this.listenToAmountChange();
    this.listenToTokenChange();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      price: new FormGroup({
        token: new FormControl('', []),
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

  listenToTokenChange(): void {
    this.priceForm
      .get('token')
      ?.valueChanges.pipe(
        skip(1), // Skip the first value because it is the default value
        filter((token: string | null) => token !== null),
        map((token: string | null) => token as string),
        takeUntil(this.destroyed$)
      )
      .subscribe((token: string) => {
        this.setUpTokenChoice.emit(token);
        const usdEnabled: boolean = this.priceForm.get('usdEnabled')?.value as boolean;
        if (usdEnabled) this.swapCurrency();
      });

    this.currentNetworkObs
      .pipe(
        filter((network: INetworkDetail | null) => network !== null),
        map((network: INetworkDetail | null) => network as INetworkDetail),
        takeUntil(this.destroyed$)
      )
      .subscribe((network: INetworkDetail) => {
        this.priceForm.patchValue({
          token: network.nativeCurrency.id
        });
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

  goToPreviousPage(): void {
    --this.page;
    return;
  }

  goToNextPage(): void {
    if (this.mainForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.page === PaymentMakePage.settingPrice) {
      const { amount } = this.priceControls;
      if ((amount.value as number) <= 0) {
        this.snackbar.open('Amount must be greater than 0', 'Close', { duration: 3000 });
        return;
      }

      this.walletService.networkIsMatching$.pipe(take(1)).subscribe((networkIsValid) => {
        if (!networkIsValid) {
          this.snackbar.open('Your current network selected is not matching with your wallet', 'Close', {
            duration: 3000
          });
          return;
        }

        this.generatePaymentRequest();

        ++this.page;
      });
    } else {
      ++this.page;
    }
    return;
  }

  generatePaymentRequest(): Subscription {
    const { username, publicAddress, avatarUrl } = this.profileControls;
    const { amount, description, usdEnabled } = this.priceControls;

    return combineLatest([this.currentNetworkObs, this.paymentTokenObs])
      .pipe(
        take(1),
        filter((payload: [INetworkDetail | null, IToken | null]) => payload[0] !== null && payload[1] !== null),
        map((payload: [INetworkDetail | null, IToken | null]) => payload as [INetworkDetail, IToken])
      )
      .subscribe(([network, token]) => {
        const paymentRequest: IPaymentRequest = {
          chainId: network.chainId,
          tokenId: token.tokenId,
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
      });
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

enum PaymentMakePage {
  settingProfile = 0,
  settingPrice = 1,
  review = 2
}
