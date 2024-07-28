import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import web3 from 'web3';
import { CommonButtonText } from './../../../../../../shared/enum';
import { ITokenCreationPayload } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { PriceFeedService } from './../../../../../../shared/services/price-feed/price-feed.service';

const PRICE_OF_CREATING_TOKEN = 10;

@Component({
  selector: 'app-token-creation-review[tokenPayloadReview]',
  templateUrl: './token-creation-review.component.html',
  styleUrl: './token-creation-review.component.scss'
})
export class TokenCreationReviewComponent implements OnInit {
  @Input() tokenPayloadReview: ITokenCreationPayload;
  @Output() createTokenEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() goBackEvent: EventEmitter<void> = new EventEmitter<void>();
  commonButtonText = CommonButtonText;
  invoiceAmount: number = 0;
  priceError: string | null;
  networkDetailSelected: INetworkDetail;

  constructor(
    public formatService: FormatService,
    public web3LoginService: Web3LoginService,
    private priceFeedService: PriceFeedService
  ) {}

  get errorRetreivingPrice(): boolean {
    return !!this.priceError || this.invoiceAmount === 0;
  }

  get priceOfCreatingToken(): number {
    return PRICE_OF_CREATING_TOKEN;
  }

  get optionsChecked(): string[] {
    return [
      this.tokenPayloadReview.canBurn ? 'Burnable' : null,
      this.tokenPayloadReview.canMint ? 'Mintable' : null,
      this.tokenPayloadReview.canPause ? 'Pausable' : null
    ].filter((option): option is string => option !== null);
  }

  ngOnInit(): void {
    this.getCurrentPriceOfNativeToken();
    this.initNetworkDetailSelected();
  }

  createTokenEventTrigger(): void {
    return this.createTokenEvent.emit(web3.utils.toWei(String(this.invoiceAmount), 'ether'));
  }

  private async getCurrentPriceOfNativeToken(): Promise<void> {
    try {
      const price: number = await this.priceFeedService.getCurrentPriceOfNativeTokenFromNode(
        this.tokenPayloadReview.network
      );
      this.invoiceAmount = this.priceOfCreatingToken / price;
    } catch (error: unknown) {
      this.priceError = $localize`:@@ErrorMessageRetrievePrice.Desc:Failed to get the current price of the native network token. Please try again later.`;
    }
  }

  private initNetworkDetailSelected(): void {
    this.networkDetailSelected = this.web3LoginService.getNetworkDetailByChainId(this.tokenPayloadReview.network);
  }
}
