import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { INetworkDetail, NetworkChainId, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  ReplaySubject,
  Subscription,
  take,
  takeUntil
} from 'rxjs';
import { tokenList } from './../../../../../../shared/data/tokenList';
import { AuthStatusCode, CommonButtonText, ICommonButtonText, TokenPair } from './../../../../../../shared/enum';
import {
  ActionStoreProcessing,
  IPaymentRequest,
  IToken,
  PaymentTypes,
  StoreState
} from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { networkChange } from './../../../../../../store/auth-store/state/actions';
import { selectAuthStatus, selectCurrentChainId } from './../../../../../../store/auth-store/state/selectors';
import {
  applyConversionTokenFromPayNow,
  decryptRawPaymentRequest,
  payNowTransaction
} from './../../../../../../store/payment-request-store/state/actions';
import {
  DataConversionStore,
  selectConversionToken,
  selectPaymentConversion,
  selectPaymentRequestDetail,
  selectPayNowIsProcessing
} from './../../../../../../store/payment-request-store/state/selectors';

interface NetworkGroup {
  networkName: string;
  chainId: NetworkChainId;
  tokens: IToken[];
}

interface ITokenForm {
  amount: FormControl<number | null>;
  tokenId: FormControl<TokenId | null>;
}

@Component({
  selector: 'app-pay-now-page',
  templateUrl: './pay-now-page.component.html',
  styleUrls: ['./pay-now-page.component.scss']
})
export class PayNowPageComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  mainForm: FormGroup<ITokenForm> = new FormGroup<ITokenForm>({
    amount: new FormControl<number | null>(10, [Validators.required, Validators.min(0)]),
    tokenId: new FormControl<TokenId | null>(null, [Validators.required])
  });

  tokensAvailable: NetworkGroup[] = [
    {
      networkName: 'Ethereum Network',
      chainId: NetworkChainId.ETHEREUM,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some(
            (network) => network.chainId === NetworkChainId.ETHEREUM && network.priceFeed.length > 0
          ) || token.nativeToChainId === NetworkChainId.ETHEREUM
      )
    },
    {
      networkName: 'Binance Smart Chain Network',
      chainId: NetworkChainId.BNB,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some(
            (network) => network.chainId === NetworkChainId.BNB && network.priceFeed.length > 0
          ) || token.nativeToChainId === NetworkChainId.BNB
      )
    },
    {
      networkName: 'Avalanche Network',
      chainId: NetworkChainId.AVALANCHE,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some(
            (network) => network.chainId === NetworkChainId.AVALANCHE && network.priceFeed.length > 0
          ) || token.nativeToChainId === NetworkChainId.AVALANCHE
      )
    },
    {
      networkName: 'Polygon Network',
      chainId: NetworkChainId.POLYGON,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some(
            (network) => network.chainId === NetworkChainId.POLYGON && network.priceFeed.length > 0
          ) || token.nativeToChainId === NetworkChainId.POLYGON
      )
    },
    {
      networkName: 'Sepolia Network',
      chainId: NetworkChainId.SEPOLIA,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some(
            (network) => network.chainId === NetworkChainId.SEPOLIA && network.priceFeed.length > 0
          ) || token.nativeToChainId === NetworkChainId.SEPOLIA
      )
    }
  ];
  networkSelected: NetworkChainId;
  commonButtonText: ICommonButtonText = CommonButtonText;
  paymentTypes = PaymentTypes;
  paymentTypeSelected: PaymentTypes = PaymentTypes.USD;

  constructor(
    public location: Location,
    public formatService: FormatService,
    private readonly store: Store,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private web3LoginService: Web3LoginService
  ) {}

  readonly requestDetail$: Observable<StoreState<IPaymentRequest | null>> =
    this.store.select(selectPaymentRequestDetail);
  readonly conversionToken$: Observable<StoreState<number | null>> = this.store.select(selectConversionToken);
  readonly selectPayNowIsProcessing$: Observable<ActionStoreProcessing> = this.store.select(selectPayNowIsProcessing);
  readonly authStatus$: Observable<AuthStatusCode> = this.store.select(selectAuthStatus);
  private readonly currentChainId$: Observable<NetworkChainId | null> = this.store.select(selectCurrentChainId);
  readonly paymentConversion$: Observable<DataConversionStore> = this.store.select(selectPaymentConversion);

  get routeId(): string {
    return this.route.snapshot.params['id'];
  }

  get currentTokenUsed(): IToken | undefined {
    return this.tokensAvailable
      .map((network: NetworkGroup) => network.tokens)
      .flat()
      .find((token: IToken) => token.tokenId === (this.mainForm.get('tokenId')?.value as TokenId));
  }

  get tokenConversion$(): Observable<string> {
    return this.conversionToken$.pipe(
      filter((conversion: StoreState<number | null>) => conversion.data !== null && !!this.currentTokenUsed),
      map((conversion: StoreState<number | null>) => (conversion.data as number) + ' ' + this.currentTokenUsed?.symbol)
    );
  }

  get paymentConversionFormatted$(): Observable<string> {
    return this.paymentConversion$.pipe(
      filter(
        (conversion: DataConversionStore) =>
          conversion.conversionToken.data !== null || conversion.conversionUSD.data !== null
      ),
      map((conversion: DataConversionStore) => {
        if (this.paymentTypeSelected === PaymentTypes.TOKEN) {
          return '$' + (conversion.conversionUSD.data as number);
        } else {
          return (conversion.conversionToken.data as number) + ' ' + this.currentTokenUsed?.symbol;
        }
      })
    );
  }

  get actionBtnText$(): Observable<string> {
    return this.authStatus$.pipe(
      map((status: AuthStatusCode) =>
        status === AuthStatusCode.NotConnected
          ? $localize`:@@PayButton.ConnectWallet:Connect Wallet`
          : $localize`:@@PayButton.PayNow:Pay Now`
      )
    );
  }

  get networkNameSelected(): string | undefined {
    return this.tokensAvailable.find((network: NetworkGroup) => network.chainId === this.networkSelected)?.networkName;
  }

  get switchBtnDisabled(): boolean {
    return this.mainForm.get('amount')?.disabled === true || this.mainForm.get('tokenId')?.value === null;
  }

  ngOnInit(): void {
    this.callActions();
    this.listenFormChanges();
    this.setUpPaymentFound();
  }

  networkSaved(val: NetworkChainId): void {
    this.networkSelected = val;
  }

  submitForm(): void | Subscription {
    this.mainForm.markAllAsTouched();

    if (this.mainForm.get('tokenId')?.invalid) {
      this.snackbar.open('Please select a token', '', {
        duration: 3000
      });
    }

    if (this.mainForm.invalid) return;
    else return this.processPayment();
  }

  switchPaymentType(): void {
    if (this.switchBtnDisabled) return;
    this.paymentTypeSelected = this.paymentTypeSelected === PaymentTypes.USD ? PaymentTypes.TOKEN : PaymentTypes.USD;
    this.applyConversionToken(
      this.mainForm.get('amount')?.value as number,
      this.mainForm.get('tokenId')?.value as TokenId
    );
  }

  private setUpPaymentFound(): void {
    this.requestDetail$
      .pipe(
        take(1),
        map((rd: StoreState<IPaymentRequest | null>) => rd.data),
        filter(Boolean)
      )
      .subscribe((rd: IPaymentRequest) => {
        this.networkSelected = rd.chainId as NetworkChainId;
        this.paymentTypeSelected = rd.usdEnabled ? PaymentTypes.USD : PaymentTypes.TOKEN;

        this.mainForm.patchValue({
          amount: rd.amount || 10,
          tokenId: (rd.tokenId as TokenId) || null
        });
        rd.amount && this.mainForm.get('amount')?.disable();
        rd.tokenId && this.mainForm.get('tokenId')?.disable();
      });
  }

  private processPayment(): Subscription {
    return combineLatest([this.authStatus$, this.currentChainId$])
      .pipe(take(1))
      .subscribe(([status, chainId]) => {
        if (status === AuthStatusCode.NotConnected) {
          return this.web3LoginService.openLoginModal();
        }
        if (this.networkSelected !== chainId) {
          const network: INetworkDetail = this.web3LoginService.getNetworkDetailByChainId(this.networkSelected);
          return this.store.dispatch(networkChange({ network }));
        } else {
          return this.store.dispatch(
            payNowTransaction({
              amount: this.mainForm.get('amount')?.value as number,
              chainId: chainId as NetworkChainId,
              token: this.currentTokenUsed as IToken,
              lockInUSD: this.paymentTypeSelected === PaymentTypes.USD
            })
          );
        }
      });
  }

  private callActions(): void {
    this.store.dispatch(decryptRawPaymentRequest({ encodedRequest: this.routeId }));
  }

  private listenFormChanges(): void {
    this.mainForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(500),
        filter(() => this.mainForm.valid)
      )
      .subscribe(
        (
          val: Partial<{
            amount: number | null;
            tokenId: TokenId | null;
          }>
        ) => this.applyConversionToken(val.amount as number, val.tokenId as TokenId)
      );
  }

  private applyConversionToken(amount: number, tokenId: TokenId): void {
    const feed: TokenPair | undefined = this.currentTokenUsed?.networkSupport.find(
      (network) => network.chainId === this.networkSelected
    )?.priceFeed[0];

    const isNative: boolean = tokenList.some(
      (token) => token.tokenId === tokenId && token.nativeToChainId === this.networkSelected
    );

    if (feed !== undefined || isNative) {
      return this.store.dispatch(
        applyConversionTokenFromPayNow({
          amount: amount,
          chainId: this.networkSelected,
          pair: isNative ? null : (feed as TokenPair),
          paymentType: this.paymentTypeSelected
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
