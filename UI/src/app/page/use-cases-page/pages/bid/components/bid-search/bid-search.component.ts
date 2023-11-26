import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IUseCasesHeader } from './../../../../../../page/use-cases-page/components/use-cases-header/use-cases-header.component';
import { StoreState } from './../../../../../../shared/interfaces';
import { IBid } from './../../../../../../shared/interfaces/bid.interface';
import { resetBid, searchBid } from './../../../../../../store/bid-store/state/actions';
import { selectSearchBid } from './../../../../../../store/bid-store/state/selectors';

@Component({
  selector: 'app-bid-search',
  templateUrl: './bid-search.component.html',
  styleUrls: ['./bid-search.component.scss']
})
export class BidSearchComponent implements OnInit {
  headerPayload: IUseCasesHeader = {
    title: 'Join a bid',
    goBackLink: '/use-cases/bid/services',
    description: null
  };
  mainForm: FormGroup = new FormGroup({
    address: new FormControl('', [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{64}$/)])
  });

  constructor(private readonly store: Store) {}

  searchBid$: Observable<StoreState<IBid | null>> = this.store.select(selectSearchBid);

  get bidIsLoading$(): Observable<boolean> {
    return this.searchBid$.pipe(map(({ loading }) => loading));
  }

  get bidErrorMessage$(): Observable<string | null> {
    return this.searchBid$.pipe(map(({ error }) => error));
  }

  ngOnInit(): void {
    this.store.dispatch(resetBid());
  }

  onSubmit(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;

    return this.store.dispatch(searchBid({ txHash: this.mainForm.value.address }));
  }
}
