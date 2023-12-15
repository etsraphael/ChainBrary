import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITransactionLog } from '@chainbrary/transaction-search';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, distinctUntilChanged, filter, skip, takeUntil } from 'rxjs';
import { IUseCasesHeader } from '../../../../components/use-cases-header/use-cases-header.component';
import { setAuthPublicAddress } from './../../../../../../store/auth-store/state/actions';
import { selectCurrentNetwork, selectIsConnected } from './../../../../../../store/auth-store/state/selectors';
import { loadTransactionsFromBridgeTransfer } from './../../../../../../store/transaction-store/state/actions';
import {
  selectHistoricalTransactions,
  selectHistoricalTransactionsError,
  selectHistoricalTransactionsIsLoading
} from './../../../../../../store/transaction-store/state/selectors';

@Component({
  selector: 'app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss']
})
export class ActivityContainerComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headerPayload: IUseCasesHeader = {
    title: 'Recent Transactions',
    goBackLink: '/use-cases/services',
    description:
      'Quickly view your recent transactions on your wallet. This is working only for the native tokens of the network currently.'
  };

  constructor(
    private store: Store,
    private actions$: Actions
  ) {}

  readonly transactions$: Observable<ITransactionLog[]> = this.store.select(selectHistoricalTransactions);
  readonly transactionsIsLoading$: Observable<boolean> = this.store.select(selectHistoricalTransactionsIsLoading);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  readonly historicalTransactionsError$: Observable<string | null> = this.store.select(
    selectHistoricalTransactionsError
  );
  readonly userIsConnected$: Observable<boolean> = this.store.select(selectIsConnected);

  ngOnInit(): void {
    this.callActions();
    this.generateSubs();
    this.loginListener();
  }

  loginListener(): void {
    this.actions$.pipe(ofType(setAuthPublicAddress), takeUntil(this.destroyed$)).subscribe(() => this.callActions());
  }

  callActions(): void {
    this.store.dispatch(loadTransactionsFromBridgeTransfer({ page: 1, limit: 1000000 }));
  }

  // call list of transactions after network changes
  generateSubs(): void {
    this.currentNetwork$
      .pipe(
        distinctUntilChanged(),
        filter((network) => network !== null),
        skip(1),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.callActions());
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
