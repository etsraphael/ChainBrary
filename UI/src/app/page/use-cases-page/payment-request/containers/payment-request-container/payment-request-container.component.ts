import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthStatus } from './../../../../../store/auth-store/state/selectors';
import { AuthStatusCode } from './../../../../../shared/enum';

@Component({
  selector: 'app-payment-request-container',
  templateUrl: './payment-request-container.component.html',
  styleUrls: ['./payment-request-container.component.scss']
})
export class PaymentRequestContainerComponent implements OnInit {
  certifficationCardVisible = true;
  authStatus$: Observable<AuthStatusCode>;
  AuthStatusCodeTypes = AuthStatusCode;

  constructor(private store: Store) {}

  hideCertifficationCard(): void {
    this.certifficationCardVisible = false;
  }

  ngOnInit(): void {
    this.authStatus$ = this.store.select(selectAuthStatus);
  }
}
