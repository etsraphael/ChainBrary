import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { addAccountSent, deleteAccountSent, editAccountSent } from '../../auth-store/state/actions';
import { localTransactionSentSuccessfully } from './actions';

@Injectable()
export class TransactionEffects {
  constructor(private actions$: Actions) {}

  transactionSent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addAccountSent, editAccountSent, deleteAccountSent),
      map((action: { hash: string; networkId: number }) => {
        return localTransactionSentSuccessfully({
          card: {
            title: 'Transaction sent successfully',
            type: 'success',
            hash: action.hash,
            component: 'CertificationContainer',
            networkId: action.networkId
          }
        });
      })
    );
  });
}
