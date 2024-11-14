import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, of, switchMap } from 'rxjs';
import {
  BalanceAndAllowance,
  IERC20TokenAndBalancePayload,
  IPoolDetail,
  ITokenAndBalance
} from '../../../shared/interfaces';
import { DexService } from '../../../shared/services/dex/dex.service';
import { TokensService } from '../../../shared/services/tokens/tokens.service';
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
    private dexService: DexService,
    private tokensService: TokensService
  ) {}

  loadPool$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadPoolAction),
      switchMap((action: ReturnType<typeof DexActions.loadPoolAction>) => {
        return from(this.dexService.getPool(action.payload)).pipe(
          map((result: IPoolDetail) => DexActions.loadPoolActionSuccess({ result })),
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
          map((result: IPoolDetail) => DexActions.createPoolActionSuccess({ result })),
          catchError((error: string) => of(DexActions.createPoolActionFailure({ message: error })))
        );
      })
    );
  });

  addLiquidity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.addLiquidityAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof DexActions.addLiquidityAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.addLiquidityAction>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof DexActions.addLiquidityAction>, WalletProvider, string]) => {
        return from(this.dexService.addLiquidity(action[1], action[0].payload)).pipe(
          map((result: string) => DexActions.addLiquidityActionSuccess({ message: result })),
          catchError((error: string) => of(DexActions.addLiquidityActionFailure({ message: error })))
        );
      })
    );
  });

  lookUpToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.lookUpTokenAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (payload: [ReturnType<typeof DexActions.lookUpTokenAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.lookUpTokenAction>, WalletProvider, string]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.lookUpTokenAction>, WalletProvider, string]) => {
        const payload: IERC20TokenAndBalancePayload = {
          chainId: action[0].chainId,
          tokenAddress: action[0].address,
          from: action[2]
        };
        return from(this.dexService.getERC20TokenByAddress(payload)).pipe(
          map((result: ITokenAndBalance) => DexActions.lookUpTokenActionSuccess({ result })),
          catchError((error: string) =>
            of(DexActions.lookUpTokenActionFailure({ message: error, tokenIn: action[0].tokenIn }))
          )
        );
      })
    );
  });

  loadBalanceAndAllowance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadBalanceAndAllowanceAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (
          payload: [ReturnType<typeof DexActions.loadBalanceAndAllowanceAction>, WalletProvider | null, string | null]
        ) => payload as [ReturnType<typeof DexActions.loadBalanceAndAllowanceAction>, WalletProvider, string]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.loadBalanceAndAllowanceAction>, WalletProvider, string]) => {
        return from(this.tokensService.getBalanceAndAllowance(action[0].payload)).pipe(
          map((result: BalanceAndAllowance) => DexActions.loadBalanceAndAllowanceActionSuccess({ result })),
          catchError((error: string) => of(DexActions.loadBalanceAndAllowanceActionFailure({ message: error, tokenIn: action[0].payload.tokenIn })))
        );
      })
    );
  });
}
