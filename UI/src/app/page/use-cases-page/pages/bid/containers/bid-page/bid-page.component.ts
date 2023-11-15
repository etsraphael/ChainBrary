import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, filter, interval, map, startWith, takeUntil } from 'rxjs';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { Web3ProviderService } from './../../../../../../shared/services/web3-provider/web3-provider.service';
import { getBidByTxn, placeBid } from './../../../../../../store/bid-store/state/actions';
import { selectSearchBid } from './../../../../../../store/bid-store/state/selectors';

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent implements OnInit, AfterViewInit, OnDestroy {
  bidForm: FormGroup;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public formatService: FormatService,
    private web3ProviderService: Web3ProviderService
  ) {}

  selectSearchBid$ = this.store.select(selectSearchBid);

  get bidIsLoading$(): Observable<boolean> {
    return this.selectSearchBid$.pipe(map((state) => state.loading));
  }

  get bidError$(): Observable<string | null> {
    return this.selectSearchBid$.pipe(map((state) => state.error));
  }

  get bid$(): Observable<IBid | null> {
    return this.selectSearchBid$.pipe(map((state) => state.data));
  }

  get bidderList$(): Observable<IBidOffer[]> {
    return this.bid$.pipe(
      filter((bid) => !!bid),
      map((bid) => bid as IBid),
      map((bid: IBid) => bid.bidders)
    );
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

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(getBidByTxn({ txn: this.route.snapshot.paramMap.get('id') as string }));
    }, 1000);

    this.setUpForm();
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

  getCountdown(endTime: Date): Observable<string> {
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
    this.store.dispatch(placeBid({ amount: this.bidForm.get('highestBid')?.value as number }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  // TODO: listen to contract event here
}

export interface IBidForm {
  highestBid: FormControl<number | null>;
}
