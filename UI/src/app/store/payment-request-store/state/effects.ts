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
        return PaymentRequestActions.generatePaymentRequestSuccess({
          paymentRequest: decodedPaymentRequest
        });
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
}
