import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail, WalletProvider } from '@chainbrary/web3-login';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, of, switchMap, tap } from 'rxjs';
import { selectCurrentNetwork, selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { IReceiptTransaction } from './../../../shared/interfaces';
import { IBid } from './../../../shared/interfaces/bid.interface';
import { BidService } from './../../../shared/services/bid/bid.service';
import * as BidActions from './actions';
import { selectBidContractAddress } from './selectors';

@Injectable()
export class BidEffects {
  readonly errorMessage: string[] = [
    'Auction not ongoing',
    'You are already the highest bidder',
    'Bid amount after fee deduction is not high enough'
  ];

  constructor(
    private readonly store: Store,
    private actions$: Actions,
    private bidService: BidService,
    private snackBar: MatSnackBar
  ) {}

  getBidByTxn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.getBidByTxn),
      concatLatestFrom(() => [this.store.select(selectCurrentNetwork), this.store.select(selectWalletConnected)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof BidActions.getBidByTxn>, INetworkDetail | null, WalletProvider | null]) =>
          payload as [ReturnType<typeof BidActions.getBidByTxn>, INetworkDetail, WalletProvider]
      ),
      switchMap((action: [ReturnType<typeof BidActions.getBidByTxn>, INetworkDetail, WalletProvider]) => {
        return from(this.bidService.getBidFromTxnHash(action[2], action[0].txn)).pipe(
          map((response: IBid) => BidActions.getBidByTxnSuccess({ payload: response })),
          catchError((error: { message: string; code: number }) =>
            of(BidActions.getBidByTxnFailure({ message: error.message }))
          )
        );
      })
    );
  });

  placeBid$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.placeBid),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectBidContractAddress)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (payload: [ReturnType<typeof BidActions.placeBid>, WalletProvider | null, string | null, string | null]) =>
          payload as [ReturnType<typeof BidActions.placeBid>, WalletProvider, string, string]
      ),
      switchMap((action: [ReturnType<typeof BidActions.placeBid>, WalletProvider, string, string]) => {
        return from(this.bidService.placeBid(action[1], action[2], action[0].amount, action[3])).pipe(
          map((response: IReceiptTransaction) =>
            BidActions.placeBidSuccess({ txn: response.transactionHash, contractAddress: response.to })
          ),
          catchError((error: string) => of(BidActions.placeBidFailure({ message: error })))
        );
      })
    );
  });

  placeBidError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BidActions.placeBidFailure),
        map((action: { message: string }) => {
          let formattedMessage = String(action.message);
          let isErrorKnown = false;

          this.errorMessage.forEach((knownError: string) => {
            if (formattedMessage.includes(knownError)) {
              formattedMessage = knownError;
              isErrorKnown = true;
            }
          });

          if (!isErrorKnown) {
            formattedMessage = 'An error occured while placing your bid';
          }

          return this.snackBar.open(formattedMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        })
      );
    },
    { dispatch: false }
  );

  placeBidSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.placeBidSuccess),
      tap(() =>
        this.snackBar.open('Bid placed successfully', '', {
          duration: 5000,
          panelClass: ['success-snackbar']
        })
      ),
      map((action: { contractAddress: string }) => {
        return BidActions.getBidByTxn({ txn: action.contractAddress });
      })
    );
  });
}
