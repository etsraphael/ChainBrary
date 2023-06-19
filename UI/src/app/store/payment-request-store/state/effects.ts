import { Injectable } from '@angular/core';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Buffer } from 'buffer';
import { catchError, filter, map, of } from 'rxjs';
import { showErrorNotification, showSuccessNotification } from '../../notification-store/state/actions';
import { IPaymentRequest } from './../../../shared/interfaces';
import * as PaymentRequestActions from './actions';

@Injectable()
export class PaymentRequestEffects {
  constructor(private actions$: Actions, private web3LoginService: Web3LoginService) {}

  isIPaymentRequest(obj: IPaymentRequest): obj is IPaymentRequest {
    return (
      typeof obj === 'object' && obj !== null && typeof obj.publicAddress === 'string' && typeof obj.amount === 'number'
    );
  }

  generatePayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.generatePaymentRequest),
      map((action: { encodedRequest: string }) => {
        const decodedPayment = Buffer.from(
          action.encodedRequest.replace('+', '-').replace('/', '_'),
          'base64'
        ).toString('utf-8');
        const decodedPaymentRequest: IPaymentRequest = JSON.parse(decodedPayment);
        if (this.isIPaymentRequest(decodedPaymentRequest)) {
          return PaymentRequestActions.generatePaymentRequestSuccess({
            paymentRequest: decodedPaymentRequest,
            network: this.web3LoginService.getNetworkDetailByChainId(decodedPaymentRequest.chainId)
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

  sendAmountTransactionsError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.amountSentFailure),
      map((action: { message: string }) => showErrorNotification({ message: action.message }))
    );
  });

  sendAmountTransactionsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.amountSentSuccess),
      filter((action: { numberConfirmation: number }) => action.numberConfirmation == 1),
      map(() => showSuccessNotification({ message: 'Transaction is processing' }))
    );
  });
}
