import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, interval, map, startWith } from 'rxjs';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { IBid } from './../../../../../../shared/interfaces/bid.interface';
import { getBidByTxn } from './../../../../../../store/bid-store/state/actions';
import { selectSearchBid } from './../../../../../../store/bid-store/state/selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bid-page',
  templateUrl: './bid-page.component.html',
  styleUrls: ['./bid-page.component.scss']
})
export class BidPageComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private route: ActivatedRoute
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

  get successfulHeader$(): Observable<IUseCasesHeader> {
    return this.bid$.pipe(
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
    // TODO: create form to update the price
  }

  getCountdown(endTime: Date): Observable<string> {
    return interval(1000).pipe(
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
}
