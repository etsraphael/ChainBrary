import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tokenList } from 'src/app/shared/data/tokenList';
import { IPaymentRequestRaw, IToken, StoreState } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { decryptRawPaymentRequest } from './../../../../../../store/payment-request-store/state/actions';
import { selectRawPaymentRequest } from './../../../../../../store/payment-request-store/state/selectors';

interface NetworkGroup {
  networkName: string;
  chainId: NetworkChainId;
  tokens: IToken[];
}

interface ITokenForm {
  amount: FormControl<number | null>;
  tokenId: FormControl<string | null>;
}

@Component({
  selector: 'app-pay-now-page',
  templateUrl: './pay-now-page.component.html',
  styleUrls: ['./pay-now-page.component.scss']
})
export class PayNowPageComponent implements OnInit {
  mainForm = new FormGroup<ITokenForm>({
    amount: new FormControl<number | null>(10, [Validators.required, Validators.min(0)]),
    tokenId: new FormControl<string | null>(null, [Validators.required])
  });

  tokensAvailable: NetworkGroup[] = [
    {
      networkName: 'Ethereum Network',
      chainId: NetworkChainId.ETHEREUM,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some((network) => network.chainId === NetworkChainId.ETHEREUM) ||
          token.nativeToChainId === NetworkChainId.ETHEREUM
      )
    },
    {
      networkName: 'Binance Smart Chain Network',
      chainId: NetworkChainId.BNB,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some((network) => network.chainId === NetworkChainId.BNB) ||
          token.nativeToChainId === NetworkChainId.BNB
      )
    },
    {
      networkName: 'Avalanche Network',
      chainId: NetworkChainId.AVALANCHE,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some((network) => network.chainId === NetworkChainId.AVALANCHE) ||
          token.nativeToChainId === NetworkChainId.AVALANCHE
      )
    },
    {
      networkName: 'Polygon Network',
      chainId: NetworkChainId.POLYGON,
      tokens: tokenList.filter(
        (token: IToken) =>
          token.networkSupport.some((network) => network.chainId === NetworkChainId.POLYGON) ||
          token.nativeToChainId === NetworkChainId.POLYGON
      )
    }
  ];
  networkSelected: NetworkChainId;

  constructor(
    public location: Location,
    public formatService: FormatService,
    private readonly store: Store,
    private route: ActivatedRoute
  ) {}

  get routeId(): string {
    return this.route.snapshot.params['id'];
  }

  // get currentTokenSelected$(): IToken | undefined {
  //   return this.mainForm.get('tokenId');
  // }

  readonly rawRequest$: Observable<StoreState<IPaymentRequestRaw | null>> = this.store.select(selectRawPaymentRequest);

  ngOnInit(): void {
    this.callActions();
  }

  networkSaved(val: NetworkChainId): void {
    this.networkSelected = val;
  }

  submitForm(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;

    console.log(this.mainForm.value);
  }


  private callActions(): void {
    this.store.dispatch(decryptRawPaymentRequest({ encodedRequest: this.routeId }));
  }
}
