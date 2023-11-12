import { Injectable } from '@angular/core';
import { INetworkDetail, WalletProvider } from '@chainbrary/web3-login';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, of, switchMap } from 'rxjs';
import { selectCurrentNetwork } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { IBid } from './../../../shared/interfaces/bid.interface';
import { BidService } from './../../../shared/services/bid/bid.service';
import * as BidActions from './actions';

@Injectable()
export class BidEffects {
  constructor(
    private readonly store: Store,
    private actions$: Actions,
    private bidService: BidService
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
        return from(this.bidService.getBidFromTxnHash(action[2], action[0].txn, action[1].chainId)).pipe(
          map((response: IBid) => BidActions.getBidByTxnSuccess({ payload: response })),
          catchError((error: { message: string; code: number }) => of(BidActions.getBidByTxnFailure({ message: error.message })))
        );
      })
    );
  });
}
