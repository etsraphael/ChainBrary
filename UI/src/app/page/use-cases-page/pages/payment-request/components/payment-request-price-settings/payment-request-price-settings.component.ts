import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INetworkDetail, NetworkChainId } from '@chainbrary/web3-login';
import { Observable, ReplaySubject, filter, map, takeUntil } from 'rxjs';
import { tokenList } from './../../../../../../shared/data/tokenList';
import { IToken, ITokenContract, PriceSettingsForm, TokenChoiceMakerForm } from './../../../../../../shared/interfaces';
import { DataConversionStore } from './../../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-request-price-settings[priceForm][paymentConversion][currentNetworkObs]',
  templateUrl: './payment-request-price-settings.component.html',
  styleUrls: ['./payment-request-price-settings.component.scss']
})
export class PaymentRequestPriceSettingsComponent implements OnInit, OnDestroy {
  @Input() priceForm: FormGroup<PriceSettingsForm>;
  @Input() tokenSelected: IToken | null;
  @Input() paymentConversion: DataConversionStore;
  @Input() currentNetworkObs: Observable<INetworkDetail | null>;
  @Output() goToNextPage = new EventEmitter<void>();
  @Output() goToPreviousPage = new EventEmitter<void>();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  tokenList: IToken[] = [];
  tokenGroup: IToken[] = tokenList.filter((token: IToken) => token.nativeToChainId !== undefined);

  get tokenChoiceForm(): FormGroup<TokenChoiceMakerForm> {
    return this.priceForm.get('token') as FormGroup<TokenChoiceMakerForm>;
  }

  get paymentConversionIsNotSupported(): boolean {
    return this.paymentConversion.conversionUSD.error !== null;
  }

  ngOnInit(): void {
    this.setUpTokenList();
  }

  saveGroup(chainId: NetworkChainId): void {
    return this.tokenChoiceForm.get('chainId')?.setValue(chainId);
  }

  setUpTokenList(): void {
    this.currentNetworkObs
      .pipe(
        filter((x: INetworkDetail | null) => x !== null),
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

  getTokenByChainId(chainId: NetworkChainId): IToken[] {
    return tokenList.filter(
      (token: IToken) =>
        token.nativeToChainId === chainId ||
        token.networkSupport.some((network: ITokenContract) => network.chainId === chainId)
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
