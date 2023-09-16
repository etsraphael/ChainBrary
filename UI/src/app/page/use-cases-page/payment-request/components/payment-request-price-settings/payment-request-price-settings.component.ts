import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Observable, ReplaySubject, filter, map, takeUntil } from 'rxjs';
import { tokenList } from './../../../../../shared/data/tokenList';
import {
  IConversionToken,
  IToken,
  ITokenContract,
  PriceSettingsForm,
  StoreState
} from './../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-price-settings[priceForm][paymentConversion][currentNetworkObs]',
  templateUrl: './payment-request-price-settings.component.html',
  styleUrls: ['./payment-request-price-settings.component.scss']
})
export class PaymentRequestPriceSettingsComponent implements OnInit, OnDestroy {
  @Input() priceForm: FormGroup<PriceSettingsForm>;
  @Input() tokenSelected: IToken | null;
  @Input() paymentConversion: StoreState<IConversionToken>;
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
  @Output() goToNextPage = new EventEmitter<void>();
  @Output() goToPreviousPage = new EventEmitter<void>();
  @Output() swapCurrency = new EventEmitter<void>();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  tokenList: IToken[] = [];

  get usdEnabled(): boolean {
    return this.paymentConversion.data.priceInUsdEnabled;
  }

  ngOnInit(): void {
    this.setUpTokenList();
  }

  setUpTokenList(): void {
    this.currentNetworkObs
      .pipe(
        filter((x) => x !== null),
        map((x) => x as INetworkDetail),
        takeUntil(this.destroyed$)
      )
      .subscribe((currentNetwork: INetworkDetail) => {
        this.tokenList = tokenList.filter(
          (token: IToken) =>
            token.networkSupport.some((network: ITokenContract) => network.chainId === currentNetwork.chainId) ||
            token.nativeToChainId === currentNetwork.chainId
        );
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
