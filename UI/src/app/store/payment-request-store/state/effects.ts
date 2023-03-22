import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Buffer } from 'buffer';
import { catchError, map, of } from 'rxjs';
import { IPaymentRequest } from './../../../shared/interfaces';
import * as PaymentRequestActions from './actions';

@Injectable()
export class PaymentRequestEffects {
  constructor(private actions$: Actions) {}

  generatePayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.generatePaymentRequest),
      map((action: { encodedRequest: string }) => {
        const decodedPayment = Buffer.from(action.encodedRequest, 'base64').toString('utf-8');
        const decodedPaymentRequest: IPaymentRequest = JSON.parse(decodedPayment);
        if (this.isIPaymentRequest(decodedPaymentRequest)) {
          return PaymentRequestActions.generatePaymentRequestSuccess({
            paymentRequest: decodedPaymentRequest
          });
        } else {
          return PaymentRequestActions.generatePaymentRequestFailure({
            errorMessage: 'Error decoding payment request'
          });
        }
      }),
      catchError(() =>
        of(
          PaymentRequestActions.generatePaymentRequestFailure({
            errorMessage: 'Error decoding payment request'
          })
        )
      )
    );
  });

  isIPaymentRequest(obj: IPaymentRequest): obj is IPaymentRequest {
    return (
      typeof obj === 'object' && obj !== null && typeof obj.publicAddress === 'string' && typeof obj.amount === 'number'
    );
  }
}
