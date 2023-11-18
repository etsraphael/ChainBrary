import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  takeUntil
} from 'rxjs';
import { environment } from './../../../../../../../environments/environment';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { biddersListCheckSuccess } from './../../../../../../store/bid-store/state/actions';

const DEFAULT_COUNTDOWN = environment.bid.biddersCountdown;

@Component({
  selector: 'app-bid-result[bidObs][bidderListStoreObs][startBidderCountdownTrigger]',
  templateUrl: './bid-result.component.html',
  styleUrls: ['./bid-result.component.scss']
})
export class BidResultComponent implements OnInit, OnDestroy {
  @Input() bidObs: Observable<IBid>;
  @Input() bidderListStoreObs: Observable<StoreState<IBidOffer[]>>;
  @Input() startBidderCountdownTrigger: Observable<ReturnType<typeof biddersListCheckSuccess>>;
  @Output() placeBid = new EventEmitter<{ amount: number }>();
  @Output() refreshBidderList = new EventEmitter<void>();

  biddersCountdown = DEFAULT_COUNTDOWN;
  bidForm: FormGroup;
  timeRemaining: string;
  biddersCountdown$: Observable<number>;
  countdownSubscription: Subscription;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  get header$(): Observable<IUseCasesHeader> {
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

  constructor(public formatService: FormatService) {}

  ngOnInit(): void {
    this.setUpForm();
    this.setUpEndTimer();
    this.startBidderCountdownTrigger.subscribe(() => {
      this.countdownSubscription?.unsubscribe();
      this.biddersCountdown$ = interval(1000).pipe(take(DEFAULT_COUNTDOWN));
      this.countdownSubscription = this.startBidderCountdown();
    });
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
    return this.placeBid.emit({ amount: this.bidForm.get('highestBid')?.value as number });
  }

  setUpEndTimer(): Subscription {
    return this.bidObs
      .pipe(
        map((bid: IBid) => new Date(bid.auctionEndTime)),
        takeUntil(this.destroyed$)
      )
      .subscribe((endTime: Date) => {
        return interval(1000)
          .pipe(
            takeUntil(this.destroyed$),
            startWith(0),
            map(() => {
              const now = new Date();
              const distance = endTime.getTime() - now.getTime();

              if (distance < 0) {
                this.timeRemaining = 'Auction ended';
                return;
              }

              const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
