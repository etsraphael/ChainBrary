import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { concatLatestFrom } from '@ngrx/effects';
import { Buffer } from 'buffer';
import { Observable, ReplaySubject, debounceTime, filter, map, of, startWith, switchMap, take, takeUntil } from 'rxjs';
import { AuthStatusCode, TokenPair } from './../../../../../shared/enum';
import {
  IConversionToken,
  IPaymentRequest,
  IToken,
  PaymentMakerForm,
  PriceSettingsForm,
  ProfileForm,
  StoreState
} from './../../../../../shared/interfaces';
import { PriceFeedService } from './../../../../../shared/services/price-feed/price-feed.service';
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
  usdConversionRate = 0; // TODO: Remove this
  tokenConversionRate = 0;
  usdAmount: number | null;

  constructor(
    private snackbar: MatSnackBar,
    private walletService: WalletService,
    private priceFeedService: PriceFeedService
  ) {}

  get priceForm(): FormGroup<PriceSettingsForm> {
    return this.mainForm.get('price') as FormGroup<PriceSettingsForm>;
  }

  get profileForm(): FormGroup<ProfileForm> {
    return this.mainForm.get('profile') as FormGroup<ProfileForm>;
  }

  get amount(): number {
    if (this.priceForm?.get('usdEnabled')?.value as boolean) return this.tokenConversionRate;
    else return this.priceForm.get('amount')?.value as number;
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

  async setUpCurrentNativePrice(amount: number | null, chainId: NetworkChainId): Promise<void> {
    return this.priceFeedService
      .getCurrentPriceOfNativeToken(chainId)
      .then((result: number) => this.updateUsdConversion(amount, result))
      .catch(() => {
        this.usdConversionRate = 0;
      });
  }

  async setUpCurrenTokenPrice(amount: number | null, chainId: NetworkChainId): Promise<void> {
    return this.priceFeedService
      .getCurrentPrice(TokenPair.LinkToUsd, chainId) // TODO: Make it dynamic here
      .then((result: number) => this.updateUsdConversion(amount, result))
      .catch(() => {
        this.usdConversionRate = 0;
      });
  }

  updateUsdConversion(amount: number | null, priceResult: number): void {
    if (!this.mainForm.get('price')?.get('usdEnabled')?.value as boolean) {
      if (amount === null) {
        this.usdConversionRate = priceResult;
      } else {
        this.usdConversionRate = priceResult * (amount as number);
      }
      this.usdAmount = this.usdConversionRate;
    } else {
      this.tokenConversionRate = (this.priceForm.get('amount')?.value as number) / priceResult;
    }
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      price: new FormGroup({
        token: new FormControl('ethereum', []),
        description: new FormControl('', []),
        amount: new FormControl(1, [Validators.required, Validators.min(0)]),
        usdEnabled: new FormControl(false, [])
      }),
      profile: new FormGroup({
        publicAddress: new FormControl('', [Validators.required]),
        avatarUrl: new FormControl('', [], [this.urlValidator()]),
        username: new FormControl('', [Validators.required, Validators.maxLength(20)])
      })
    });
    this.currentNetworkObs
      .pipe(
        filter((network: INetworkDetail | null) => network !== null),
        map((network: INetworkDetail | null) => network as INetworkDetail)
      )
      .subscribe((network: INetworkDetail) => {
        // this.mainForm.get('price')?.get('token')?.setValue(network?.nativeCurrency?.name.toLowerCase() as string);
        this.setUpCurrentNativePrice(1, network?.chainId as NetworkChainId);
      });
  }

  listenToTokenChange(): void {
    this.priceForm
      .get('token')
      ?.valueChanges.pipe(
        filter((token: string | null) => token !== null),
        map((token: string | null) => token as string)
      )
      .subscribe((token: string) => this.setUpTokenChoice.emit(token));

    this.paymentTokenObs
      .pipe(
        takeUntil(this.destroyed$),
        filter((token: IToken | null) => token !== null)
      )
      .subscribe((token: IToken | null) => {
        // TODO: set token value with chainlink here
      });
  }

  listenToAmountChange(): void {
    this.priceForm
      .get('amount')
      ?.valueChanges.pipe(
        startWith(this.priceForm.get('amount')?.value || 0),
        debounceTime(1000),
        filter((amount: number | null) => amount !== null && amount > 0),
        map((amount: number | null) => amount as number)
      )
      .subscribe((amount: number) => this.applyConversionToken.emit(amount as number));

    this.priceForm
      .get('amount')
      ?.valueChanges.pipe(
        startWith(this.priceForm.get('amount')?.value || 0),
        debounceTime(1000),
        filter((amount: number | null) => amount !== null && amount > 0),
        switchMap((amount: number | null) => {
          return this.currentNetworkObs.pipe(
            take(1),
            filter(
              (currentNetwork: INetworkDetail | null) => currentNetwork !== null && currentNetwork?.chainId !== null
            ),
            map((currentNetwork: INetworkDetail | null) => ({ amount: amount, currentNetwork: currentNetwork }))
          );
        }),
        concatLatestFrom(() => this.paymentTokenObs),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        ([{ amount, currentNetwork }, token]: [
          { amount: number | null; currentNetwork: INetworkDetail | null },
          IToken | null
        ]) => {
          if (token) {
            this.setUpCurrenTokenPrice(amount, currentNetwork?.chainId as NetworkChainId);
          } else {
            this.setUpCurrentNativePrice(amount, currentNetwork?.chainId as NetworkChainId);
          }

          if (this.mainForm.get('price')?.get('usdEnabled')?.value as boolean) {
            this.usdAmount = amount as number;
          } else {
            this.usdAmount = null;
          }
        }
      );
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

  generatePaymentRequest(): void {
    const { username, publicAddress, avatarUrl } = this.profileControls;
    const { amount, description, usdEnabled } = this.priceControls;

    this.currentNetworkObs.pipe(take(1)).subscribe((network: INetworkDetail | null) => {
      const paymentRequest: IPaymentRequest = {
        chainId: network?.chainId as NetworkChainId,
        tokenId: '0',
        username: username.value as string,
        publicAddress: publicAddress.value as string,
        amount: amount.value as number,
        description: description.value as string,
        avatarUrl: avatarUrl.value as string,
        usdEnabled: usdEnabled.value as boolean
      };
      const paymentRequestBase64: string = Buffer.from(JSON.stringify(paymentRequest), 'utf-8')
        .toString('base64')
        .replace('+', '-')
        .replace('/', '_');
      const url: URL = new URL(window.location.href);
      const origin = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
      this.linkGenerated = `${origin}/payment-page/${paymentRequestBase64}`;
    });
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

    // TODO: Remove this
    if (!this.priceForm?.get('usdEnabled')?.value as boolean) {
      this.priceForm.patchValue({
        amount: this.usdConversionRate,
        usdEnabled: true
      });
    } else {
      this.currentNetworkObs
        .pipe(
          filter((network: INetworkDetail | null) => network !== null),
          map((network: INetworkDetail | null) => network?.chainId as NetworkChainId)
        )
        .subscribe((chainId: NetworkChainId) => {
          this.priceFeedService
            .getCurrentPriceOfNativeToken(chainId)
            .then((result: number) => {
              this.priceForm.patchValue({
                amount: (this.priceForm.get('amount')?.value as number) / result,
                usdEnabled: false
              });
            })
            .catch(() => (this.usdConversionRate = 0));
        });
    }
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
