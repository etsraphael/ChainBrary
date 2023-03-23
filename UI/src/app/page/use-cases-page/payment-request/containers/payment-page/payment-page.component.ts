import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { generatePaymentRequest } from './../../../../../store/payment-request-store/state/actions';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import {
  selectPaymentRequest
} from './../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  selectPaymentRequestState: Observable<IPaymentRequestState>

  constructor(private route: ActivatedRoute, private store: Store) {
    this.setUpId();
  }

  setUpId(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.store.dispatch(generatePaymentRequest({ encodedRequest: params['id'] }));
      }
    });
  }

  ngOnInit(): void {
    this.selectPaymentRequestState = this.store.select(selectPaymentRequest);
  }
}
