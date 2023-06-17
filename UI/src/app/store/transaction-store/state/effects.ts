import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { addAccountSent, deleteAccountSent, editAccountSent } from '../../auth-store/state/actions';
import { localTransactionSentSuccessfully } from './actions';
import { amountSent } from '../../payment-request-store/state/actions';

@Injectable()
export class TransactionEffects {
  constructor(private actions$: Actions) {}

  certificationTransactionSent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addAccountSent, editAccountSent, deleteAccountSent),
      map((action: { hash: string; chainId: number }) => {
        return localTransactionSentSuccessfully({
          card: {
            title: 'Transaction sent successfully',
            type: 'success',
            hash: action.hash,
            component: 'CertificationContainer',
            chainId: action.chainId
          }
        });
      })
    );
  });

  paymentTransactionSent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(amountSent),
      map((action: { hash: string; chainId: number }) => {
        return localTransactionSentSuccessfully({
          card: {
            title: 'Transaction sent successfully',
            type: 'success',
            hash: action.hash,
            component: 'PaymentPageComponent',
            chainId: action.chainId
          }
        });
      })
    );
  });
}
