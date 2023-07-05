import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PriceSettingsForm } from './../../../../../shared/interfaces';
import { PriceFeedService } from './../../../../../shared/services/price-feed/price-feed.service';
import { debounceTime, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-payment-request-price-settings[priceForm][networkSymbol]',
  templateUrl: './payment-request-price-settings.component.html',
  styleUrls: ['./payment-request-price-settings.component.scss']
})
export class PaymentRequestPriceSettingsComponent implements OnInit {
  @Input() priceForm: FormGroup<PriceSettingsForm>;
  @Input() networkSymbol: string | null;
  @Input() usdAmount: number | null;
  @Output() goToNextPage = new EventEmitter<void>();
  @Output() goToPreviousPage = new EventEmitter<void>();
  @Output() swapCurrency = new EventEmitter<void>();
  usdConversionRate: number


  constructor(
    private priceFeedService: PriceFeedService
  ) {}

  ngOnInit(): void {
    this.listenToAmountChange()
  }

  listenToAmountChange(): void {
    this.priceForm
      .get('amount')
      ?.valueChanges.pipe(
        filter((amount: number | null) => amount !== null && amount > 0),
        debounceTime(1000)
      )
      .subscribe((amount: number | null) => {
        if(this.priceForm.get('usdEnabled')?.value!) {
          this.setUpPriceCurrentPrice(amount);
        }
      });
  }


  async setUpPriceCurrentPrice(amount: number | null): Promise<number> {
    return this.priceFeedService
      .getCurrentPriceOfNativeToken('11155111')
      .then((result: number) => {
        if (amount === null) {
          return (this.usdConversionRate = result);
        } else {
          return (this.usdConversionRate = this.priceForm.get('amount')?.value! / result);
        }
      })
      .catch(() => (this.usdConversionRate = 0));
  }

}
