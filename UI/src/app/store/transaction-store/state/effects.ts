import { Injectable } from '@angular/core';
import { ITransactionLog, TransactionOptions, TransactionSearchService } from '@chainbrary/transaction-search';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, from, map, of } from 'rxjs';
import Web3 from 'web3';
import { amountSent } from '../../payment-request-store/state/actions';
import {
  loadTransactionsFromBridgeTransfer,
  loadTransactionsFromBridgeTransferFailure,
  loadTransactionsFromBridgeTransferSuccess,
  localTransactionSentSuccessfully
} from './actions';

@Injectable()
export class TransactionEffects {
  constructor(private actions$: Actions, private transactionSearchService: TransactionSearchService) {}

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

  loadTransactionsFromBridgeTransfer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadTransactionsFromBridgeTransfer),
      concatMap((action: { chainId: NetworkChainId; page: number; limit: number }) => {
        const options: TransactionOptions = {
          web3: new Web3(window.ethereum),
          pagination: {
            page: action.page,
            limit: action.limit
          },
          address: {
            smartContractAddress: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81',
            accountAddress: '0xA9ad87470Db27ed18a9a8650f057A7cAab7703Ac'
          }
        };

        return from(this.transactionSearchService.getTransactions(options)).pipe(
          map((list: ITransactionLog[]) => loadTransactionsFromBridgeTransferSuccess({ list })),
          catchError((error: string) => of(loadTransactionsFromBridgeTransferFailure({ error })))
        );
      })
    );
  });
}
