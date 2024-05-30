import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITransactionCard } from './../../../../../../shared/interfaces';
import { selectRecentTransactionsByComponent } from './../../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-pay-now-successful-page',
  templateUrl: './pay-now-successful-page.component.html',
  styleUrls: ['./pay-now-successful-page.component.scss']
})
export class PayNowSuccessfulPageComponent {
  constructor(
    public location: Location,
    private readonly store: Store,
    private route: ActivatedRoute
  ) {}

  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('PaymentPageComponent')
  );

  get cardContent(): ITransactionCard {
    return {
      title: 'Transaction successful!',
      type: 'success',
      hash: this.route.snapshot.queryParams['hash'],
      component: 'PayNowSuccessfulPageComponent',
      chainId: this.route.snapshot.queryParams['network']
    };
  }

  get price(): string {
    return this.route.snapshot.queryParams['amount'] + ' ' + this.route.snapshot.queryParams['currency'];
  }
}
