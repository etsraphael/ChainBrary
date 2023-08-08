import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { environment } from './../../../../../../environments/environment';
import { tokenList } from './../../../../../shared/data/tokenList';
import { IConversionToken, IToken, PriceSettingsForm, StoreState } from './../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-price-settings[priceForm][networkSymbol][paymentConversion]',
  templateUrl: './payment-request-price-settings.component.html',
  styleUrls: ['./payment-request-price-settings.component.scss']
})
export class PaymentRequestPriceSettingsComponent implements OnInit {
  @Input() priceForm: FormGroup<PriceSettingsForm>;
  @Input() networkSymbol: string | null;
  @Input() usdConversionRate: number | null; // TODO: Remove this
  @Input() tokenConversionRate: number | null; // TODO: Remove this
  @Input() tokenSelected: IToken | null;
  @Input() paymentConversion: StoreState<IConversionToken>;
  @Output() goToNextPage = new EventEmitter<void>();
  @Output() goToPreviousPage = new EventEmitter<void>();
  @Output() swapCurrency = new EventEmitter<void>();
  tokenList: IToken[] = tokenList;

  constructor(private web3LoginService: Web3LoginService) {}

  get usdEnabled(): boolean {
    return this.priceForm.get('usdEnabled')?.value || false;
  }

  ngOnInit(): void {
    this.setUpTokenList();
  }

  setUpTokenList(): void {
    const nativeToken: IToken[] = this.web3LoginService
      .getNetworkDetailList()
      .filter(({ chainId }: INetworkDetail) => environment.contracts.bridgeTransfer.networkSupported.includes(chainId))
      .map((network: INetworkDetail) => {
        return {
          tokenId: null,
          decimals: network.nativeCurrency.decimals,
          name: network.name,
          symbol: network.nativeCurrency.symbol,
          networkSupport: []
        };
      });
    this.tokenList = [...this.tokenList, ...nativeToken];
  }
}
