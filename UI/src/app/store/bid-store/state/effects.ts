import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { INetworkDetail, WalletProvider } from '@chainbrary/web3-login';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Contract } from 'web3-eth-contract';
import { selectCurrentNetwork, selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { IReceiptTransaction, KeyAndLabel } from './../../../shared/interfaces';
import { IBid, IBidRefreshResponse } from './../../../shared/interfaces/bid.interface';
import { BidService } from './../../../shared/services/bid/bid.service';
import * as BidActions from './actions';
import { selectBidContractAddress, selectBlockNumber } from './selectors';

@Injectable()
export class BidEffects {
  readonly errorMessage: KeyAndLabel[] = [
    { key: 'auction_not_ongoing', label: 'Auction not ongoing' },
    { key: 'already_highest_bidder', label: 'You are already the highest bidder' },
    { key: 'bid_amount_not_high_enough', label: 'Bid amount is not high enough' }
  ];

  constructor(
    private readonly store: Store,
    private actions$: Actions,
    private bidService: BidService,
    private snackBar: MatSnackBar,
    private router: Router
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
          mergeMap((response: IBid) => [
            BidActions.getBidByTxnSuccess({ payload: response }),
            BidActions.bidRefreshCheck()
          ]),
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

          this.errorMessage.forEach((knownError: KeyAndLabel) => {
            if (formattedMessage.includes(knownError.key)) {
              formattedMessage = knownError.label;
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

  placeBidSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BidActions.placeBidSuccess),
        tap(() =>
          this.snackBar.open('Bid placed successfully', '', {
            duration: 5000,
            panelClass: ['success-snackbar']
          })
        )
      );
    },
    { dispatch: false }
  );

  createBid$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.createBid),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof BidActions.createBid>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof BidActions.createBid>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof BidActions.createBid>, WalletProvider, string]) => {
        return from(this.bidService.deployBidContract(action[1], action[2], action[0].payload)).pipe(
          map((response: { contract: Contract; transactionHash: string }) =>
            BidActions.createBidSuccess({ txn: response.transactionHash })
          ),
          catchError((error: string) => of(BidActions.createBidFailure({ message: error })))
        );
      })
    );
  });

  createBidSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.createBidSuccess),
      tap((action: { txn: string }) => {
        this.router.navigate(['/use-cases/bid/search/', action.txn]);
        this.snackBar.open('Bid created successfully', '', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      }),
      map((action: { txn: string }) => {
        return BidActions.getBidByTxn({ txn: action.txn });
      })
    );
  });

  getbidRefresh$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.bidRefreshCheck),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectBidContractAddress),
        this.store.select(selectBlockNumber)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [ReturnType<typeof BidActions.bidRefreshCheck>, WalletProvider | null, string | null, string | null]
        ) => payload as [ReturnType<typeof BidActions.bidRefreshCheck>, WalletProvider, string, string]
      ),
      switchMap((action: [ReturnType<typeof BidActions.bidRefreshCheck>, WalletProvider, string, string]) => {
        return from(this.bidService.getBidderListWithDetails(action[1], action[3], action[2])).pipe(
          map((response: IBidRefreshResponse) => BidActions.bidRefreshCheckSuccess({ bidDetails: response })),
          catchError((error: string) => of(BidActions.bidRefreshCheckFailure({ message: error })))
        );
      })
    );
  });

  requestWithdraw = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.requestWithdraw),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectBidContractAddress)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [ReturnType<typeof BidActions.requestWithdraw>, WalletProvider | null, string | null, string | null]
        ) => payload as [ReturnType<typeof BidActions.requestWithdraw>, WalletProvider, string, string]
      ),
      switchMap((action: [ReturnType<typeof BidActions.requestWithdraw>, WalletProvider, string, string]) => {
        return from(this.bidService.requestWithdraw(action[1], action[2], action[3])).pipe(
          map((response: IReceiptTransaction) => BidActions.requestWithdrawSuccess({ txn: response.transactionHash })),
          tap(() => {
            this.snackBar.open('Withdraw request sent successfully', '', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          }),
          catchError((error: { message: string }) => of(BidActions.requestWithdrawFailure({ message: error.message })))
        );
      })
    );
  });

  requestWithdrawFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BidActions.requestWithdrawFailure),
        map((action: { message: string }) => {
          return this.snackBar.open(action.message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        })
      );
    },
    { dispatch: false }
  );

  searchBid$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BidActions.searchBid),
      concatLatestFrom(() => [this.store.select(selectCurrentNetwork), this.store.select(selectWalletConnected)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof BidActions.searchBid>, INetworkDetail | null, WalletProvider | null]) =>
          payload as [ReturnType<typeof BidActions.searchBid>, INetworkDetail, WalletProvider]
      ),
      switchMap((action: [ReturnType<typeof BidActions.searchBid>, INetworkDetail, WalletProvider]) => {
        return from(this.bidService.getBidFromTxnHash(action[2], action[0].txHash)).pipe(
          tap(() => this.router.navigate(['/use-cases/bid/search/', action[0].txHash])),
          mergeMap((response: IBid) => [
            BidActions.searchBidSuccess({ payload: response }),
            BidActions.bidRefreshCheck()
          ]),
          catchError(() =>
            of(
              BidActions.searchBidFailure({
                message:
                  'This address is not associated with any bids that have been created. Please make sure the network is correct and try again.'
              })
            )
          )
        );
      })
    );
  });
}
