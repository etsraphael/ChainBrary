import { Injectable } from '@angular/core';
import { WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, of, switchMap } from 'rxjs';
import {
  BalanceAndAllowance,
  IERC20TokenAndBalancePayload,
  IPoolDetail,
  IPoolDetailForm,
  IQuoteResult,
  IToken
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
        return from(this.dexService.addLiquidity(action[2], action[0].payload)).pipe(
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
        return from(this.tokensService.getERC20TokenByAddress(action[0].chainId, action[0].address )).pipe(
          map((result: IToken) => DexActions.lookUpTokenActionSuccess({ result })),
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
          catchError((error: string) =>
            of(DexActions.loadBalanceAndAllowanceActionFailure({ message: error, tokenIn: action[0].payload.tokenIn }))
          )
        );
      })
    );
  });

  approveAllowance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.approveAllowanceAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (payload: [ReturnType<typeof DexActions.approveAllowanceAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.approveAllowanceAction>, WalletProvider, string]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.approveAllowanceAction>, WalletProvider, string]) => {
        return from(this.tokensService.approve(action[0].payload)).pipe(
          map((result: boolean) =>
            result
              ? DexActions.approveAllowanceActionSuccess()
              : DexActions.approveAllowanceActionFailure({ message: 'Failed to approve allowance' })
          ),
          catchError((error: string) => of(DexActions.approveAllowanceActionFailure({ message: error })))
        );
      })
    );
  });

  loadQuoteAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadQuoteAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (payload: [ReturnType<typeof DexActions.loadQuoteAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.loadQuoteAction>, WalletProvider, string]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.loadQuoteAction>, WalletProvider, string]) => {
        return from(this.dexService.getAmountsOut(action[0].payload)).pipe(
          map((result: IQuoteResult) => DexActions.loadQuoteActionSuccess({ result })),
          catchError((error: string) => of(DexActions.loadQuoteActionFailure({ message: error })))
        );
      })
    );
  });

  swapAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.swapAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (payload: [ReturnType<typeof DexActions.swapAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.swapAction>, WalletProvider, string]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.swapAction>, WalletProvider, string]) => {
        return from(this.dexService.swapExactTokensForTokens(action[0].payload)).pipe(
          map((result: string) => DexActions.swapActionSuccess({ message: result })),
          catchError((error: string) => {
            console.log('swapAction$ error', error);
            return of(DexActions.swapActionFailure({ message: error }));
          })
        );
      })
    );
  });

  preloadLiquidityFormAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.preloadLiquidityFormAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (payload: [ReturnType<typeof DexActions.preloadLiquidityFormAction>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof DexActions.preloadLiquidityFormAction>, WalletProvider, string]
      ),
      // filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.preloadLiquidityFormAction>, WalletProvider, string]) => {
        return from(this.dexService.preloadLiquidityForm(action[0].payload)).pipe(
          map((result: IPoolDetailForm) => DexActions.preloadLiquidityFormActionSuccess({ result })),
          catchError((error: string) => of(DexActions.preloadLiquidityFormActionFailure({ message: error }))
          )
        );
      })
    );
  })
}
