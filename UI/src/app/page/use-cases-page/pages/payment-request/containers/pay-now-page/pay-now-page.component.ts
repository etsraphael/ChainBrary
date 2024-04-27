import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPaymentRequestRaw, StoreState } from './../../../../../../shared/interfaces';
import { selectRawPaymentRequest } from './../../../../../../store/payment-request-store/state/selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pay-now-page',
  templateUrl: './pay-now-page.component.html',
  styleUrls: ['./pay-now-page.component.scss']
})
export class PayNowPageComponent {
  constructor(
    public location: Location,
    private readonly store: Store
  ) {}

  readonly rawRequest$: Observable<StoreState<IPaymentRequestRaw | null>> = this.store.select(selectRawPaymentRequest);
}
