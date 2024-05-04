import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITransactionCard } from './../../../../../../shared/interfaces';
import { selectRecentTransactionsByComponent } from './../../../../../../store/transaction-store/state/selectors';
import { NetworkChainId } from '@chainbrary/web3-login';

@Component({
  selector: 'app-pay-now-successful-page',
  templateUrl: './pay-now-successful-page.component.html',
  styleUrls: ['./pay-now-successful-page.component.scss']
})
export class PayNowSuccessfulPageComponent {
  constructor(
    public location: Location,
    private readonly store: Store
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
}
