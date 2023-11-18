import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Observable,
  ReplaySubject,
  Subscription,
  combineLatest,
  filter,
  interval,
  map,
  startWith,
  switchMap,
  take,
  takeUntil
} from 'rxjs';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { setAuthPublicAddress } from './../../../../../../store/auth-store/state/actions';
import { selectIsConnected } from './../../../../../../store/auth-store/state/selectors';
import {
  biddersListCheck,
  biddersListCheckSuccess,
  getBidByTxn,
  placeBid
} from './../../../../../../store/bid-store/state/actions';
import { selectBidders, selectSearchBid } from './../../../../../../store/bid-store/state/selectors';

const DEFAULT_COUNTDOWN = 60;

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent implements OnInit, AfterViewInit, OnDestroy {
  bidForm: FormGroup;
  biddersCountdown = DEFAULT_COUNTDOWN;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public formatService: FormatService,
    public web3LoginService: Web3LoginService,
    private actions$: Actions
  ) {}

  searchBidStore$: Observable<StoreState<IBid | null>> = this.store.select(selectSearchBid);
  bidderListStore$: Observable<StoreState<IBidOffer[]>> = this.store.select(selectBidders);
  userIsConnected$: Observable<boolean> = this.store.select(selectIsConnected);
  biddersCountdown$: Observable<number>;
  countdownSubscription: Subscription

  get bidIsLoading$(): Observable<boolean> {
    return this.searchBidStore$.pipe(map((state) => state.loading));
  }

  get bidError$(): Observable<string | null> {
    return this.searchBidStore$.pipe(map((state) => state.error));
  }

  get bid$(): Observable<IBid | null> {
    return this.searchBidStore$.pipe(map((state) => state.data));
  }

  get bidEnded$(): Observable<boolean> {
    return this.bid$.pipe(
      filter((bid) => !!bid),
      map((bid) => bid as IBid),
      map((bid: IBid) => new Date(bid.auctionEndTime)),
      map((endTime: Date) => {
        const now = new Date();
        const distance = endTime.getTime() - now.getTime();

        if (distance < 0) {
          return true;
        }

        return false;
      })
    );
  }

  get bidderList$(): Observable<IBidOffer[]> {
    return this.bidderListStore$.pipe(map((state) => state.data));
  }

  get bidderListIsLoading$(): Observable<boolean> {
    return this.bidderListStore$.pipe(map((state) => state.loading));
  }

  get successfulHeader$(): Observable<IUseCasesHeader> {
    return this.bid$.pipe(
      filter((bid) => !!bid),
      map((bid) => bid as IBid),
      map((bid: IBid) => ({
        title: bid.bidName,
        goBackLink: null,
        description: null
      }))
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

  get countdown$(): Observable<string> {
    return this.bid$.pipe(
      filter((bid) => !!bid),
      map((bid) => bid as IBid),
      map((bid: IBid) => new Date(bid.auctionEndTime)),
      switchMap((endTime: Date) => {
        return interval(1000).pipe(
          takeUntil(this.destroyed$),
          startWith(0),
          map(() => {
            const now = new Date();
            const distance = endTime.getTime() - now.getTime();

            if (distance < 0) {
              return 'Auction ended';
            }

            const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

            return (
              hours.toString().padStart(2, '0') +
              'h : ' +
              minutes.toString().padStart(2, '0') +
              'm : ' +
              seconds.toString().padStart(2, '0') +
              's'
            );
          })
        );
      })
    );
  }

  ngOnInit(): void {
    this.setUpForm();
    this.callActions();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  setUpForm(): void {
    this.bid$
      .pipe(
        filter((bid) => !!bid),
        map((bid) => bid as IBid),
        takeUntil(this.destroyed$)
      )
      .subscribe((bid) => {
        this.bidForm = new FormGroup({
          highestBid: new FormControl(bid.highestBid, [Validators.required, Validators.min(bid.highestBid)])
        });
      });
  }

  incrementBid(): void {
    const currentBid = this.bidForm.get('highestBid')?.value;
    this.bidForm.get('highestBid')?.setValue(currentBid + 1);
  }

  decrementBid(): void {
    const currentBid = this.bidForm.get('highestBid')?.value;
    if (currentBid > 0) {
      this.bidForm.get('highestBid')?.setValue(currentBid - 1);
    }
  }

  onSubmit(): void {
    return this.store.dispatch(placeBid({ amount: this.bidForm.get('highestBid')?.value as number }));
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

    // start countdown when bid is loaded
    this.actions$
      .pipe(
        ofType(biddersListCheckSuccess),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.countdownSubscription?.unsubscribe();
        this.biddersCountdown$ = interval(1000).pipe(take(DEFAULT_COUNTDOWN));
        this.countdownSubscription = this.startBidderCountdown();
      });
  }

  startBidderCountdown(): Subscription {
    return combineLatest([this.biddersCountdown$, this.bidEnded$, this.bidderListIsLoading$])
      .pipe(
        filter(([, bidEnded, bidderListIsLoading]) => !bidEnded && !bidderListIsLoading),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        if (this.biddersCountdown !== 1) {
          this.biddersCountdown--;
        } else {
          this.biddersCountdown = DEFAULT_COUNTDOWN + 1;
          this.refreshBidderList();
        }
      });
  }

  refreshBidderList(): void {
    return this.store.dispatch(biddersListCheck());
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}

export interface IBidForm {
  highestBid: FormControl<number | null>;
}
