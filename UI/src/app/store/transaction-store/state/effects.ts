import { Injectable } from '@angular/core';
import { ITransactionLog, TransactionOptions, TransactionSearchService } from '@chainbrary/transaction-search';
import { NetworkChainId } from '@chainbrary/web3-login';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, filter, from, map, of } from 'rxjs';
import Web3 from 'web3';
import { amountSent } from '../../payment-request-store/state/actions';
import {
  loadTransactionsFromBridgeTransfer,
  loadTransactionsFromBridgeTransferFailure,
  loadTransactionsFromBridgeTransferSuccess,
  localTransactionSentSuccessfully
} from './actions';
import { Store } from '@ngrx/store';
import { selectCurrentChainId, selectPublicAddress } from '../../auth-store/state/selectors';
import { environment } from 'src/environments/environment';

@Injectable()
export class TransactionEffects {
  constructor(
    private actions$: Actions,
    private transactionSearchService: TransactionSearchService,
    private store: Store
  ) {}

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
      concatLatestFrom(() => [this.store.select(selectPublicAddress), this.store.select(selectCurrentChainId)]),
      filter((action) => action[1] !== null && action[2] !== null),
      concatMap(
        (action: [{ page: number; limit: number }, string | null, NetworkChainId | null]) => {
          const addressContract: string = environment.contracts.bridgeTransfer.contracts.find(
            (contract) => contract.chainId === action[2]
          )?.address as string;

          const options: TransactionOptions = {
            web3: new Web3(window.ethereum),
            pagination: {
              page: action[0].page,
              limit: action[0].limit
            },
            address: {
              smartContractAddress: addressContract,
              accountAddress: action[1] as string
            }
          };

          return from(this.transactionSearchService.getTransactions(options)).pipe(
            map((list: ITransactionLog[]) => loadTransactionsFromBridgeTransferSuccess({ list })),
            catchError((error: string) => of(loadTransactionsFromBridgeTransferFailure({ error })))
          );
        }
      )
    );
  });
}
