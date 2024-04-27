import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IPaymentRequestRaw, StoreState } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { decryptRawPaymentRequest } from './../../../../../../store/payment-request-store/state/actions';
import { selectRawPaymentRequest } from './../../../../../../store/payment-request-store/state/selectors';

@Component({
  selector: 'app-pay-now-page',
  templateUrl: './pay-now-page.component.html',
  styleUrls: ['./pay-now-page.component.scss']
})
export class PayNowPageComponent implements OnInit {
  constructor(
    public location: Location,
    public formatService: FormatService,
    private readonly store: Store,
    private route: ActivatedRoute
  ) {}

  get routeId(): string {
    return this.route.snapshot.params['id'];
  }

  readonly rawRequest$: Observable<StoreState<IPaymentRequestRaw | null>> = this.store.select(selectRawPaymentRequest);

  ngOnInit(): void {
    this.callActions();
  }

  private callActions(): void {
    this.store.dispatch(decryptRawPaymentRequest({ encodedRequest: this.routeId }));
  }
}
