import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITransactionCard } from './../../../../../../shared/interfaces';
import { selectRecentTransactionsByComponent } from './../../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-pay-now-successful-page',
  templateUrl: './pay-now-successful-page.component.html',
  styleUrls: ['./pay-now-successful-page.component.scss']
})
export class PayNowSuccessfulPageComponent implements OnInit {
  constructor(
    public location: Location,
    private readonly store: Store,
    private route: ActivatedRoute
  ) {}

  readonly transactionCards$: Observable<ITransactionCard[]> = this.store.select(
    selectRecentTransactionsByComponent('PaymentPageComponent')
  );

  // TODO: Remove this test data
  cardContentTest: ITransactionCard = {
    title: 'Transaction successful!',
    type: 'success',
    hash: '0f9g34jhgf083hgfjf9jk2940fg8h24f9-pgh2',
    component: 'PayNowSuccessfulPageComponent',
    chainId: NetworkChainId.ETHEREUM
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log('params', params);
      // TODO: Keep going here
    });
  }
}
