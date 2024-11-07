import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, of, switchMap } from 'rxjs';
import { DexService } from '../../../shared/services/dex/dex.service';
import { selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import * as DexActions from './actions';

@Injectable()
export class SwapEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private readonly store: Store,
    private router: Router,
    private dexService: DexService
  ) {}

  loadPool$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadPoolAction),
      switchMap((action: ReturnType<typeof DexActions.loadPoolAction>) => {
        return from(this.dexService.getPool(action.payload)).pipe(
          map((response: string) => {
            console.log('response', response);
            return DexActions.loadPoolActionSuccess({ message: response })
          }),
          catchError((error: string) => of(DexActions.loadPoolActionFailure({ message: error })))
        );
      })
    );
  });

  createPool$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.createPoolAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof DexActions.createPoolAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.createPoolAction>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof DexActions.createPoolAction>, WalletProvider, string]) => {
        return from(this.dexService.createPool(action[2], action[0].payload)).pipe(
          map((response: string) => {
            console.log('response', response);
            return DexActions.createPoolActionSuccess({ message: response })
          }),
          catchError((error: string) => {
            console.log('error', error);
            return of(DexActions.createPoolActionFailure({ message: error }))
          })
        );
      })
    );
  });
}
