import { Injectable } from '@angular/core';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { amountSent } from '../../payment-request-store/state/actions';
import { localTransactionSentSuccessfully } from './actions';

@Injectable()
export class TransactionEffects {
  constructor(private actions$: Actions) {}

  paymentTransactionSent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(amountSent),
      map((action: { hash: string; chainId: NetworkChainId }) => {
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
