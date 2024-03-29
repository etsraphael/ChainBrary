import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INetworkDetail } from '@chainbrary/web3-login';
import {
  Observable,
  ReplaySubject,
  Subscription,
  combineLatest,
  filter,
  interval,
  map,
  startWith,
  take,
  takeUntil,
  withLatestFrom
} from 'rxjs';
import { environment } from './../../../../../../../environments/environment';
import { IHeaderBodyPage } from './../../../../../../shared/components/header-body-page/header-body-page.component';
import { ActionStoreProcessing, StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { bidRefreshCheckSuccess, requestWithdrawSuccess } from './../../../../../../store/bid-store/state/actions';

const DEFAULT_COUNTDOWN = environment.bid.biddersCountdown;

@Component({
  selector:
    'app-bid-result[bidObs][bidderListStoreObs][startBidderCountdownTrigger][isOwner][bidWidthdrawingObs][requestWithdrawSuccessObs]',
  templateUrl: './bid-result.component.html',
  styleUrls: ['./bid-result.component.scss']
})
export class BidResultComponent implements OnInit, OnDestroy {
  @Input() bidObs: Observable<IBid>;
  @Input() bidderListStoreObs: Observable<StoreState<IBidOffer[]>>;
  @Input() startBidderCountdownTrigger: Observable<ReturnType<typeof bidRefreshCheckSuccess>>;
  @Input() isOwner: boolean;
  @Input() bidWidthdrawingObs: Observable<ActionStoreProcessing>;
  @Input() requestWithdrawSuccessObs: Observable<ReturnType<typeof requestWithdrawSuccess>>;
  @Input() currentNetwork: INetworkDetail;
  @Output() placeBid = new EventEmitter<{ amount: number }>();
  @Output() refreshBidderList = new EventEmitter<void>();
  @Output() requestWithdraw = new EventEmitter<void>();

  biddersCountdown = DEFAULT_COUNTDOWN;
  bidForm: FormGroup;
  timeRemaining: string;
  biddersCountdown$: Observable<number>;
  countdownSubscription: Subscription;
  widthdrawTaken = false;
  tenMinutesLeft = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  private timerSubscription: Subscription | null = null;

  get header$(): Observable<IHeaderBodyPage> {
    return this.bidObs.pipe(
      map((bid: IBid) => ({
        title: bid.bidName,
        goBackLink: null,
        description: null
      }))
    );
  }

  get bidEnded$(): Observable<boolean> {
    return this.bidObs.pipe(
      map((bid: IBid) => new Date(bid.auctionEndTime)),
      map((endTime: Date) => {
        const now = new Date();
        return endTime.getTime() - now.getTime() < 0;
      })
    );
  }

  get bidderListIsLoading$(): Observable<boolean> {
    return this.bidderListStoreObs.pipe(map((state) => state.loading));
  }

  get bidderList$(): Observable<IBidOffer[]> {
    return this.bidderListStoreObs.pipe(map((state) => state.data));
  }

  get withdrawBtnIsVisible$(): Observable<boolean> {
    return this.bidEnded$.pipe(
      withLatestFrom(
        this.bidObs.pipe(map((bid) => bid.auctionAmountWithdrawn === false && bid.highestBid > 0)),
        this.isWidthdrawing$
      ),
      map(
        ([bidEnded, bidCondition, isWidthdrawing]) =>
          bidEnded && bidCondition && !isWidthdrawing && !this.widthdrawTaken && this.isOwner
      )
    );
  }

  get withdrawReceiptIsVisible$(): Observable<boolean> {
    return this.bidObs.pipe(map((bid) => (bid.auctionAmountWithdrawn && this.isOwner === true) || this.widthdrawTaken));
  }

  get explorerLink$(): Observable<string> {
    return this.bidObs.pipe(map((bid) => `https://etherscan.io/address/${bid.conctractAddress}`));
  }

  get isWidthdrawing$(): Observable<boolean> {
    return this.bidWidthdrawingObs.pipe(map((state) => state.isLoading));
  }

  constructor(public formatService: FormatService) {}

  ngOnInit(): void {
    this.setUpForm();
    this.setUpEndTimer();
    this.startBidderCountdownTrigger.subscribe(() => {
      this.countdownSubscription?.unsubscribe();
      this.biddersCountdown$ = interval(1000).pipe(take(DEFAULT_COUNTDOWN));
      this.countdownSubscription = this.startBidderCountdown();
    });
    this.listenForWithdrawSuccess();
  }

  setUpForm(): void {
    this.bidObs
      .pipe(
        map((bid) => bid.highestBid),
        takeUntil(this.destroyed$)
      )
      .subscribe((highestBid: number) => {
        this.bidForm = new FormGroup({
          highestBid: new FormControl(highestBid, [Validators.required, Validators.min(highestBid)])
        });
      });
  }

  incrementBid(): void {
    const bidCreation = this.bidForm.get('highestBid')?.value;
    this.bidForm.get('highestBid')?.setValue(bidCreation + 1);
  }

  decrementBid(): void {
    const bidCreation = this.bidForm.get('highestBid')?.value;
    if (bidCreation > 0) {
      this.bidForm.get('highestBid')?.setValue(bidCreation - 1);
    }
  }

  onSubmit(): void {
    return this.placeBid.emit({ amount: this.bidForm.get('highestBid')?.value as number });
  }

  setUpEndTimer(): Subscription {
    return this.bidObs
      .pipe(
        map((bid: IBid) => new Date(bid.auctionEndTime)),
        takeUntil(this.destroyed$)
      )
      .subscribe((endTime: Date) => {
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = interval(1000)
          .pipe(
            takeUntil(this.destroyed$),
            startWith(0),
            map(() => {
              const now = new Date();
              const distance = endTime.getTime() - now.getTime();

              if (distance < 0) {
                this.timeRemaining = $localize`:@@bidResult.AuctionEnded:Auction ended`;
                this.tenMinutesLeft = false;
                return;
              }

              const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

              // indicate if 10 minutes left
              if (minutes <= 10 && hours === 0) {
                this.tenMinutesLeft = true;
              }

              this.timeRemaining =
                hours.toString().padStart(2, '0') +
                'h : ' +
                minutes.toString().padStart(2, '0') +
                'm : ' +
                seconds.toString().padStart(2, '0') +
                's';
            })
          )
          .subscribe();
      });
  }

  startBidderCountdown(): Subscription {
    const bidderListIsLoading$ = this.bidderListStoreObs.pipe(map((state) => state.loading));

    return combineLatest([this.biddersCountdown$, this.bidEnded$, bidderListIsLoading$])
      .pipe(
        filter(([, bidEnded, bidderListIsLoading]) => !bidEnded && !bidderListIsLoading),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        if (this.biddersCountdown !== 1) {
          this.biddersCountdown--;
        } else {
          this.biddersCountdown = DEFAULT_COUNTDOWN + 1;
          this.refreshBidderList.emit();
        }
      });
  }

  listenForWithdrawSuccess(): Subscription {
    return this.requestWithdrawSuccessObs.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.widthdrawTaken = true;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.timerSubscription?.unsubscribe();
  }
}
