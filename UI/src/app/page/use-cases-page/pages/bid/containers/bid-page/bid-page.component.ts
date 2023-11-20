import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, filter, map, takeUntil, withLatestFrom } from 'rxjs';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { setAuthPublicAddress } from './../../../../../../store/auth-store/state/actions';
import { selectIsConnected, selectPublicAddress } from './../../../../../../store/auth-store/state/selectors';
import {
  bidRefreshCheck,
  bidRefreshCheckSuccess,
  getBidByTxn,
  placeBid
} from './../../../../../../store/bid-store/state/actions';
import { selectBidders, selectSearchBid } from './../../../../../../store/bid-store/state/selectors';

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    public web3LoginService: Web3LoginService,
    private actions$: Actions
  ) {}

  searchBidStore$: Observable<StoreState<IBid | null>> = this.store.select(selectSearchBid);
  bidderListStore$: Observable<StoreState<IBidOffer[]>> = this.store.select(selectBidders);
  userIsConnected$: Observable<boolean> = this.store.select(selectIsConnected);
  startBidderCountdownTrigger$: Observable<ReturnType<typeof bidRefreshCheckSuccess>> = this.actions$.pipe(
    ofType(bidRefreshCheckSuccess),
    takeUntil(this.destroyed$)
  );

  get isOwner$(): Observable<boolean> {
    return this.bid$.pipe(
      withLatestFrom(this.store.select(selectPublicAddress)),
      filter(([bid, address]) => bid !== null && address !== null),
      map(([bid, address]) => bid.owner.toLowerCase() === address?.toLowerCase()),
      takeUntil(this.destroyed$)
    );
  }

  get bidIsLoading$(): Observable<boolean> {
    return this.searchBidStore$.pipe(map((state) => state.loading));
  }

  get bidError$(): Observable<string | null> {
    return this.searchBidStore$.pipe(map((state) => state.error));
  }

  get bid$(): Observable<IBid> {
    return this.searchBidStore$.pipe(map((state) => state.data as IBid));
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

  get failureHeader(): IUseCasesHeader {
    return {
      title: 'Bid not found',
      goBackLink: '/use-cases/bid/search',
      description: null
    };
  }

  get loginHeader(): IUseCasesHeader {
    return {
      title: 'Bid page',
      goBackLink: '/use-cases/bid/search',
      description: null
    };
  }

  ngOnInit(): void {
    this.callActions();
  }

  onSubmit(event: { amount: number }): void {
    return this.store.dispatch(placeBid({ amount: event.amount }));
  }

  callActions(): void {
    // load bid when user is connected
    this.actions$
      .pipe(
        ofType(setAuthPublicAddress),
        filter(
          (event: { publicAddress: string }) =>
            this.route.snapshot.paramMap.get('id') !== null && event.publicAddress !== null
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.store.dispatch(getBidByTxn({ txn: this.route.snapshot.paramMap.get('id') as string })));
  }

  refreshBidderList(): void {
    return this.store.dispatch(bidRefreshCheck());
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}

export interface IBidForm {
  highestBid: FormControl<number | null>;
}
