import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IEditAllowancePayload } from '@chainbrary/token-bridge';
import { WalletProvider, Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, mergeMap, of, switchMap, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  BalanceAndAllowance,
  IBalanceAndAllowancePayload,
  ILiquidityBalanceCheckPayload,
  IPoolDetail,
  IPoolDetailForm,
  IQuoteResult,
  IRemoveLiquidityPayload,
  IToken,
  ITokenContract,
  StoreState
} from '../../../shared/interfaces';
import { DexService } from '../../../shared/services/dex/dex.service';
import { TokensService } from '../../../shared/services/tokens/tokens.service';
import { selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { localTransactionSentSuccessfully } from '../../transaction-store/state/actions';
import * as DexActions from './actions';
import { selectLiquidityBalance, selectPoolContractAddress, selectPoolDetail, selectTokensDetails } from './selectors';

@Injectable()
export class SwapEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private readonly store: Store,
    private dexService: DexService,
    private tokensService: TokensService
  ) {}

  removeLiquidity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.removeLiquidityAction),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectPoolDetail),
        this.store.select(selectLiquidityBalance)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (
          payload: [
            ReturnType<typeof DexActions.removeLiquidityAction>,
            WalletProvider | null,
            string | null,
            StoreState<IPoolDetail | null>,
            number[]
          ]
        ) =>
          payload as [
            ReturnType<typeof DexActions.removeLiquidityAction>,
            WalletProvider,
            string,
            StoreState<IPoolDetail>,
            number[]
          ]
      ),
      switchMap(
        (
          action: [
            ReturnType<typeof DexActions.removeLiquidityAction>,
            WalletProvider,
            string,
            StoreState<IPoolDetail>,
            number[]
          ]
        ) => {
          const payload: IRemoveLiquidityPayload = {
            poolAddress: action[3].data?.contractAddress as string,
            liquidity: action[4][0] + action[4][1],
            chainId: action[0].chainId
          };
          return from(this.dexService.removeLiquidity(action[2], payload)).pipe(
            map((hash: string) =>
              DexActions.removeLiquidityActionSuccess({
                hash,
                chainId: action[0].chainId
              })
            ),
            catchError((error: string) => of(DexActions.removeLiquidityActionFailure({ message: error })))
          );
        }
      )
    );
  });

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
          map((result: { poolDetail: IPoolDetail; transactionHash: string }) =>
            DexActions.createPoolActionSuccess({
              result: result.poolDetail,
              hash: result.transactionHash,
              chainId: result.poolDetail.chainId
            })
          ),
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
          mergeMap((hash: string) => [
            DexActions.addLiquidityActionSuccess({
              chainId: action[0].payload.chainId,
              hash,
              token1Amount: action[0].payload.token1Amount,
              token2Amount: action[0].payload.token2Amount
            }),
            DexActions.loadPoolAction({
              payload: {
                chainId: action[0].payload.chainId,
                token1Address: action[0].payload.token1.networkSupport.find(
                  (network: ITokenContract) => network.chainId === action[0].payload.chainId
                )?.address as string,
                token2Address: action[0].payload.token2.networkSupport.find(
                  (network: ITokenContract) => network.chainId === action[0].payload.chainId
                )?.address as string
              }
            })
          ]),
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
        return from(this.tokensService.getERC20TokenByAddress(action[0].chainId, action[0].address)).pipe(
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
      mergeMap((action: [ReturnType<typeof DexActions.loadBalanceAndAllowanceAction>, WalletProvider, string]) => {
        return from(this.tokensService.getBalanceAndAllowance(action[2], action[0].payload)).pipe(
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
        const payload: IEditAllowancePayload = {
          tokenAddress: action[0].tokenAddress,
          chainId: action[0].chainId,
          owner: action[2],
          spender: action[0].spender,
          amount: action[0].amount
        };

        return from(this.tokensService.approve(payload)).pipe(
          map((result: boolean) =>
            result
              ? DexActions.approveAllowanceActionSuccess({
                  tokenAddress: action[0].tokenAddress,
                  view: action[0].view,
                  tokenId: action[0].tokenId,
                  chainId: action[0].chainId
                })
              : DexActions.approveAllowanceActionFailure({
                  tokenAddress: action[0].tokenAddress,
                  message: 'Failed to approve allowance',
                  view: action[0].view
                })
          ),
          catchError((error: string) =>
            of(
              DexActions.approveAllowanceActionFailure({
                tokenAddress: action[0].tokenAddress,
                message: error,
                view: action[0].view
              })
            )
          )
        );
      })
    );
  });

  loadQuoteAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadQuoteAction),
      switchMap((action: ReturnType<typeof DexActions.loadQuoteAction>) => {
        return from(this.dexService.getAmountsOut(action.payload)).pipe(
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
        return from(this.dexService.swapExactTokensForTokens(action[0].payload, action[2])).pipe(
          map((hash: string) =>
            DexActions.swapActionSuccess({
              hash,
              chainId: action[0].payload.chainId
            })
          ),
          catchError((error: string) => of(DexActions.swapActionFailure({ message: error })))
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
      switchMap((action: [ReturnType<typeof DexActions.preloadLiquidityFormAction>, WalletProvider, string]) => {
        return from(this.dexService.preloadLiquidityForm(action[0].payload)).pipe(
          map((result: IPoolDetailForm) => DexActions.preloadLiquidityFormActionSuccess({ result })),
          catchError((error: string) => of(DexActions.preloadLiquidityFormActionFailure({ message: error })))
        );
      })
    );
  });

  showLoginModalBeforeAddingLiquidity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.addLiquidityAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] === null || payload[2] === null),
      switchMap((action: [ReturnType<typeof DexActions.addLiquidityAction>, WalletProvider | null, string | null]) => {
        const dialog: MatDialogRef<Web3LoginComponent> = this.web3LoginService.openLoginModal();
        return dialog.afterClosed().pipe(
          switchMap(() =>
            this.web3LoginService.onWalletConnectedEvent$.pipe(
              take(1),
              map(() => DexActions.addLiquidityAction(action[0]))
            )
          )
        );
      })
    );
  });

  showLoginModalBeforeCreatingPool$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.createPoolAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] === null || payload[2] === null),
      switchMap((action: [ReturnType<typeof DexActions.createPoolAction>, WalletProvider | null, string | null]) => {
        const dialog: MatDialogRef<Web3LoginComponent> = this.web3LoginService.openLoginModal();
        return dialog.afterClosed().pipe(
          switchMap(() =>
            this.web3LoginService.onWalletConnectedEvent$.pipe(
              take(1),
              map(() => DexActions.createPoolAction(action[0]))
            )
          )
        );
      })
    );
  });

  showSuccessMessageForLiquidity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        DexActions.createPoolActionSuccess,
        DexActions.addLiquidityActionSuccess,
        DexActions.removeLiquidityActionSuccess
      ),
      map(
        (
          action: ReturnType<
            | typeof DexActions.createPoolActionSuccess
            | typeof DexActions.addLiquidityActionSuccess
            | typeof DexActions.removeLiquidityActionSuccess
          >
        ) => {
          return localTransactionSentSuccessfully({
            card: {
              title: 'Transaction Sent Successfully',
              type: 'success',
              hash: action.hash,
              component: 'DexLiquidityPageComponent',
              chainId: action.chainId,
              createdAt: new Date()
            }
          });
        }
      )
    );
  });

  showSuccessMessageForSwap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.swapActionSuccess),
      map((action: ReturnType<typeof DexActions.swapActionSuccess>) => {
        return localTransactionSentSuccessfully({
          card: {
            title: 'Transaction Sent Successfully',
            type: 'success',
            hash: action.hash,
            component: 'DexSwappingPageComponent',
            chainId: action.chainId,
            createdAt: new Date()
          }
        });
      })
    );
  });

  loadAllowanceAfterApproveAllowanceSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.approveAllowanceActionSuccess),
      switchMap((action: ReturnType<typeof DexActions.approveAllowanceActionSuccess>) => {
        return action.view === 'liquidity'
          ? of(DexActions.loadAllowanceAfterApproveAllowanceSuccessFromLiquidity(action))
          : of(DexActions.loadAllowanceAfterApproveAllowanceSuccessFromSwap(action));
      })
    );
  });

  loadAllowanceAfterApproveAllowanceSuccessFromLiquidity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadAllowanceAfterApproveAllowanceSuccessFromLiquidity),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokensDetails),
        this.store.select(selectPoolContractAddress)
      ]),
      map(
        (
          payload: [
            ReturnType<typeof DexActions.loadAllowanceAfterApproveAllowanceSuccessFromLiquidity>,
            WalletProvider | null,
            string | null,
            StoreState<BalanceAndAllowance | null>[],
            string | null
          ]
        ) =>
          payload as [
            ReturnType<typeof DexActions.loadAllowanceAfterApproveAllowanceSuccessFromLiquidity>,
            WalletProvider,
            string,
            StoreState<BalanceAndAllowance | null>[],
            string
          ]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap(
        (
          action: [
            ReturnType<typeof DexActions.loadAllowanceAfterApproveAllowanceSuccessFromLiquidity>,
            WalletProvider,
            string,
            StoreState<BalanceAndAllowance | null>[],
            string
          ]
        ) => {
          const [token0, token1]: [string | undefined, string | undefined] = [
            action[3][0].data?.tokenId,
            action[3][1].data?.tokenId
          ];
          const tokenIn: boolean | null =
            action[0].tokenId === token0 ? true : action[0].tokenId === token1 ? false : null;

          if (tokenIn === null) {
            return of(DexActions.loadBalanceAndAllowanceActionFailure({ message: 'Token not found', tokenIn: true }));
          }

          const payload: IBalanceAndAllowancePayload = {
            chainId: action[0].chainId,
            tokenId: action[0].tokenId,
            spender: action[4],
            tokenAddress: action[0].tokenAddress,
            tokenIn
          };

          return from(this.tokensService.getBalanceAndAllowance(action[2], payload)).pipe(
            map((result: BalanceAndAllowance) => DexActions.loadBalanceAndAllowanceActionSuccess({ result })),
            catchError((error: string) =>
              of(DexActions.loadBalanceAndAllowanceActionFailure({ message: error, tokenIn }))
            )
          );
        }
      )
    );
  });

  loadAllowanceAfterApproveAllowanceSuccessFromSwap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadAllowanceAfterApproveAllowanceSuccessFromSwap),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokensDetails)
      ]),
      map(
        (
          payload: [
            ReturnType<typeof DexActions.loadAllowanceAfterApproveAllowanceSuccessFromSwap>,
            WalletProvider | null,
            string | null,
            StoreState<BalanceAndAllowance | null>[]
          ]
        ) =>
          payload as [
            ReturnType<typeof DexActions.loadAllowanceAfterApproveAllowanceSuccessFromSwap>,
            WalletProvider,
            string,
            StoreState<BalanceAndAllowance | null>[]
          ]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap(
        (
          action: [
            ReturnType<typeof DexActions.loadAllowanceAfterApproveAllowanceSuccessFromSwap>,
            WalletProvider,
            string,
            StoreState<BalanceAndAllowance | null>[]
          ]
        ) => {
          const [token0, token1]: [string | undefined, string | undefined] = [
            action[3][0].data?.tokenId,
            action[3][1].data?.tokenId
          ];
          const tokenIn: boolean | null =
            action[0].tokenId === token0 ? true : action[0].tokenId === token1 ? false : null;

          if (tokenIn === null) {
            return of(DexActions.loadBalanceAndAllowanceActionFailure({ message: 'Token not found', tokenIn: true }));
          }

          const payload: IBalanceAndAllowancePayload = {
            chainId: action[0].chainId,
            tokenId: action[0].tokenId,
            spender: environment.contracts.swapRouter.contracts.find(
              (contract) => contract.chainId === action[0].chainId
            )?.address as string,
            tokenAddress: action[0].tokenAddress,
            tokenIn
          };

          return from(this.tokensService.getBalanceAndAllowance(action[2], payload)).pipe(
            map((result: BalanceAndAllowance) => DexActions.loadBalanceAndAllowanceActionSuccess({ result })),
            catchError((error: string) =>
              of(DexActions.loadBalanceAndAllowanceActionFailure({ message: error, tokenIn }))
            )
          );
        }
      )
    );
  });

  checkIfLiquidityBalanceIsAvailable$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadPoolActionSuccess),
      filter((action) => action.result.token1Amount > 0 && action.result.token2Amount > 0),
      concatLatestFrom(() => [this.store.select(selectWalletConnected)]),
      switchMap(([action, walletProvider]) =>
        this.store.select(selectPublicAddress).pipe(
          filter((publicAddress) => publicAddress !== null),
          take(1),
          map(
            (publicAddress) =>
              [action, walletProvider, publicAddress] as [
                ReturnType<typeof DexActions.loadPoolActionSuccess>,
                WalletProvider,
                string
              ]
          )
        )
      ),
      map(([action]) => DexActions.loadLiquidityBalanceCheckAction({ pool: action.result }))
    );
  });

  loadLiquidityBalanceCheck$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DexActions.loadLiquidityBalanceCheckAction),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      map(
        (
          payload: [ReturnType<typeof DexActions.loadLiquidityBalanceCheckAction>, WalletProvider | null, string | null]
        ) => payload as [ReturnType<typeof DexActions.loadLiquidityBalanceCheckAction>, WalletProvider, string]
      ),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      switchMap((action: [ReturnType<typeof DexActions.loadLiquidityBalanceCheckAction>, WalletProvider, string]) => {
        const payload: ILiquidityBalanceCheckPayload = {
          poolAddress: action[0].pool.contractAddress,
          chainId: action[0].pool.chainId,
          from: action[2] as string
        };
        return from(this.dexService.callLiquidityAmount(payload)).pipe(
          map((result: number[]) => DexActions.loadLiquidityBalanceCheckActionSuccess({ result })),
          catchError((error: string) => of(DexActions.loadLiquidityBalanceCheckActionFailure({ message: error })))
        );
      })
    );
  });
}
