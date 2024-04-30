import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NetworkChainId, TokenId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { tokenList } from 'src/app/shared/data/tokenList';
import { TokenPair } from 'src/app/shared/enum';
import { IPaymentRequestRaw, IToken, StoreState } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import {
  applyConversionTokenFromPayNow,
  decryptRawPaymentRequest,
  payNowTransaction
} from './../../../../../../store/payment-request-store/state/actions';
import {
  selectConversionToken,
  selectRawPaymentRequest
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

  mainForm = new FormGroup<ITokenForm>({
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
    }
  ];
  networkSelected: NetworkChainId;

  constructor(
    public location: Location,
    public formatService: FormatService,
    private readonly store: Store,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

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

  readonly rawRequest$: Observable<StoreState<IPaymentRequestRaw | null>> = this.store.select(selectRawPaymentRequest);
  readonly conversionToken$: Observable<StoreState<number | null>> = this.store.select(selectConversionToken);

  ngOnInit(): void {
    this.callActions();
    this.listenFormChanges();
  }

  networkSaved(val: NetworkChainId): void {
    this.networkSelected = val;
  }

  submitForm(): void {
    this.mainForm.markAllAsTouched();

    if (this.mainForm.get('tokenId')?.invalid) {
      this.snackbar.open('Please select a token', '', {
        duration: 3000
      });
    }

    if (this.mainForm.invalid) return;

    return this.store.dispatch(
      payNowTransaction({
        amount: this.mainForm.get('amount')?.value as number,
        chainId: this.networkSelected,
        tokenId: this.currentTokenUsed?.tokenId as TokenId
      })
    );
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
        ) => {
          const feed: TokenPair | undefined = this.currentTokenUsed?.networkSupport.find(
            (network) => network.chainId === this.networkSelected
          )?.priceFeed[0];

          const isNative: boolean = tokenList.some(
            (token) => token.tokenId === val.tokenId && token.nativeToChainId === this.networkSelected
          );

          if (feed || isNative) {
            return this.store.dispatch(
              applyConversionTokenFromPayNow({
                usdAmount: val.amount as number,
                chainId: this.networkSelected,
                pair: isNative ? null : (feed as TokenPair)
              })
            );
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
