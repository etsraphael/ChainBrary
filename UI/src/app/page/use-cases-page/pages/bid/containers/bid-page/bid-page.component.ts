import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, filter, map, takeUntil, withLatestFrom } from 'rxjs';
import { BidWithdrawalComponent } from '../../components/bid-withdrawal/bid-withdrawal.component';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { CommonButtonText } from './../../../../../../shared/enum';
import { ActionStoreProcessing, StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { networkChangeSuccess, setAuthPublicAddress } from './../../../../../../store/auth-store/state/actions';
import {
  selectCurrentNetwork,
  selectIsConnected,
  selectPublicAddress
} from './../../../../../../store/auth-store/state/selectors';
import {
  bidRefreshCheck,
  bidRefreshCheckSuccess,
  getBidByTxn,
  placeBid,
  requestWithdrawSuccess
} from './../../../../../../store/bid-store/state/actions';
import {
  selectBidCreationIsLoading,
  selectBidWidthdrawing,
  selectBidders,
  selectSearchBid
} from './../../../../../../store/bid-store/state/selectors';

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    public web3LoginService: Web3LoginService,
    private route: ActivatedRoute,
    private readonly store: Store,
    private actions$: Actions,
    private dialog: MatDialog,
    private formatService: FormatService
  ) {}

  readonly searchBidStore$: Observable<StoreState<IBid | null>> = this.store.select(selectSearchBid);
  readonly bidderListStore$: Observable<StoreState<IBidOffer[]>> = this.store.select(selectBidders);
  readonly userIsConnected$: Observable<boolean> = this.store.select(selectIsConnected);
  readonly startBidderCountdownTrigger$: Observable<ReturnType<typeof bidRefreshCheckSuccess>> = this.actions$.pipe(
    ofType(bidRefreshCheckSuccess),
    takeUntil(this.destroyed$)
  );
  readonly requestWithdrawSuccess$: Observable<ReturnType<typeof requestWithdrawSuccess>> = this.actions$.pipe(
    ofType(requestWithdrawSuccess),
    takeUntil(this.destroyed$)
  );
  readonly bidWidthdrawing$: Observable<ActionStoreProcessing> = this.store.select(selectBidWidthdrawing);
  readonly currentNetwork$: Observable<INetworkDetail | null> = this.store.select(selectCurrentNetwork);
  readonly bidCreationIsLoading$: Observable<boolean> = this.store.select(selectBidCreationIsLoading);
  readonly commonButtonText = CommonButtonText;

  get isOwner$(): Observable<boolean> {
    return this.bid$.pipe(
      withLatestFrom(this.store.select(selectPublicAddress)),
      filter(([bid, address]) => bid !== null && address !== null),
      map(([bid, address]) => bid?.owner.toLowerCase() === address?.toLowerCase()),
      takeUntil(this.destroyed$)
    );
  }

  get bidIsLoading$(): Observable<boolean> {
    return this.searchBidStore$.pipe(map((state) => state.loading));
  }

  get bidError$(): Observable<string | null> {
    return this.searchBidStore$.pipe(map((state) => state.error));
  }

  get bid$(): Observable<IBid | null> {
    return this.searchBidStore$.pipe(map((state) => state.data));
  }

  get nonNullBid$(): Observable<IBid> {
    return this.bid$.pipe(filter((bid) => bid !== null)) as Observable<IBid>;
  }

  get bidEnded$(): Observable<boolean> {
    return this.bid$.pipe(
      filter((bid) => !!bid),
      map((bid) => bid as IBid),
      map((bid: IBid) => new Date(bid.auctionEndTime)),
      map((endTime: Date) => {
        const now = new Date();
        return endTime.getTime() - now.getTime() < 0;
      })
    );
  }

  get failureHeader(): IHeaderBodyPage {
    return {
      title: 'Bid not found',
      goBackLink: '/use-cases/bid/search',
      description: null
    };
  }

  get loginHeader(): IHeaderBodyPage {
    return {
      title: 'Bid page',
      goBackLink: '/use-cases/bid/search',
      description: null
    };
  }

  get txnLink$(): Observable<string | null> {
    return this.currentNetwork$.pipe(
      takeUntil(this.destroyed$),
      filter((network) => network !== null),
      map((network) => network as INetworkDetail),
      withLatestFrom(this.route.paramMap),
      map(([network, param]) => this.formatService.generateScanLink(network.chainId, param.get('id') as string))
    );
  }

  get txnFormatted$(): Observable<string | null> {
    return this.route.paramMap.pipe(
      map((param) => param.get('id') as string),
      map((txn) => this.formatService.formatPublicAddress(txn, 6))
    );
  }

  ngOnInit(): void {
    this.callActions();
    this.listenNetworkChanged();
  }

  onSubmit(event: { amount: number }): void {
    return this.store.dispatch(placeBid({ amount: event.amount }));
  }

  refreshBidderList(): void {
    return this.store.dispatch(bidRefreshCheck());
  }

  requestWithdraw(): MatDialogRef<BidWithdrawalComponent> {
    return this.dialog.open(BidWithdrawalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4']
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private getBid(): void {
    return this.store.dispatch(getBidByTxn({ txn: this.route.snapshot.paramMap.get('id') as string }));
  }

  private listenNetworkChanged(): void {
    this.actions$.pipe(ofType(networkChangeSuccess), takeUntil(this.destroyed$)).subscribe(() => this.getBid());
  }

  private callActions(): void {
    // load bid when user is connected
    this.actions$
      .pipe(
        ofType(setAuthPublicAddress),
        filter(
          (event: { publicAddress: string }) =>
            this.route.snapshot.paramMap.get('id') !== null && event.publicAddress !== null
        ),
        withLatestFrom(this.bidCreationIsLoading$),
        filter(([, isLoading]) => !isLoading),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.getBid());
  }
}

export interface IBidForm {
  highestBid: FormControl<number | null>;
}
