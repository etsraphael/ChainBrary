import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Buffer } from 'buffer';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AccountService } from './../../../shared/services/account/account.service';
import { IPaymentRequest, IProfileAdded } from './../../../shared/interfaces';
import * as PaymentRequestActions from './actions';

@Injectable()
export class PaymentRequestEffects {
  constructor(private actions$: Actions, private accountService: AccountService) {}

  isIPaymentRequest(obj: IPaymentRequest): obj is IPaymentRequest {
    return (
      typeof obj === 'object' && obj !== null && typeof obj.publicAddress === 'string' && typeof obj.amount === 'number'
    );
  }

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

  generatePaymentRequestSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.generatePaymentRequestSuccess),
      map((action: { paymentRequest: IPaymentRequest }) =>
        PaymentRequestActions.loadVerifiedAccount({
          address: action.paymentRequest.publicAddress
        })
      )
    );
  });

  loadVerifiedAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentRequestActions.loadVerifiedAccount),
      mergeMap(
        (action: { address: string }): Actions =>
          this.accountService.getCertifiedAccountByPublicAddress(action.address).pipe(
            map(
              (
                response: ApolloQueryResult<{
                  memberAccountSaveds: IProfileAdded[];
                }>
              ) => {
                if (response.data.memberAccountSaveds.length > 0) {
                  return PaymentRequestActions.loadVerifiedAccountSuccess({
                    verifiedAccount: response.data.memberAccountSaveds[0]
                  });
                } else {
                  return PaymentRequestActions.loadVerifiedAccountFailure({
                    errorMessage: 'User not found'
                  });
                }
              }
            ),
            catchError(() =>
              of(PaymentRequestActions.loadVerifiedAccountFailure({ errorMessage: 'Error loading verified account' }))
            )
          )
      )
    );
  });
}
