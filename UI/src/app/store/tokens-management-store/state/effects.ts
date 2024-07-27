import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WalletProvider, Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { selectAuthStatus, selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { environment } from './../../../../environments/environment';
import { AuthStatusCode } from './../../../shared/enum';
import { IReceiptTransaction, ITokenSetup, StoreState } from './../../../shared/interfaces';
import { TokenSetupService } from './../../../shared/services/token-setup/token-setup.service';
import * as tokenActions from './actions';
import { selectTokenCreationRefreshCheck, selectTokenDetailData } from './selectors';

@Injectable()
export class TokenManagementEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private tokenSetupService: TokenSetupService,
    private readonly store: Store,
    private router: Router
  ) {}

  loadBalanceToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.loadBalance),
      concatLatestFrom(() => [this.store.select(selectPublicAddress), this.store.select(selectTokenDetailData)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof tokenActions.loadBalance>, string | null, ITokenSetup | null]) =>
          payload as [ReturnType<typeof tokenActions.loadBalance>, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.loadBalance>, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.getBalance({
            tokenAddress: action[2].contractAddress,
            owner: action[1],
            chainId: action[2].chainId
          })
        ).pipe(
          map((response: number) => tokenActions.loadBalanceSuccess({ balance: response })),
          catchError(() =>
            of(
              tokenActions.loadBalanceFailure({
                message: $localize`:@@tokenManagement.balanceLoadFailure:Balance load failed`
              })
            )
          )
        );
      })
    );
  });

  createTokenWithoutConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.createToken),
      concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
      filter(([, authStatus]) => authStatus === AuthStatusCode.NotConnected),
      switchMap((action: [ReturnType<typeof tokenActions.createToken>, AuthStatusCode]) => {
        const dialog: MatDialogRef<Web3LoginComponent> = this.web3LoginService.openLoginModal();
        return dialog.afterClosed().pipe(
          switchMap(() =>
            this.web3LoginService.onWalletConnectedEvent$.pipe(
              take(1),
              map(() => tokenActions.deployToken({ payload: action[0].payload, amountInWei: action[0].amountInWei }))
            )
          )
        );
      })
    );
  });

  createTokenWithConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.createToken),
      concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
      filter(([, authStatus]) => authStatus === AuthStatusCode.Connected),
      map((action: [ReturnType<typeof tokenActions.createToken>, AuthStatusCode]) =>
        tokenActions.deployToken({ payload: action[0].payload, amountInWei: action[0].amountInWei })
      )
    );
  });

  deployToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.deployToken),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof tokenActions.deployToken>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof tokenActions.deployToken>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.deployToken>, WalletProvider, string]) => {
        return from(
          this.tokenSetupService.deployCustomERC20TokenContract(
            action[2],
            action[0].payload,
            action[0].payload.network,
            action[0].amountInWei
          )
        ).pipe(
          map((response: string) =>
            tokenActions.tokenCreationChecking({ txn: response, chainId: action[0].payload.network })
          ),
          tap((action: ReturnType<typeof tokenActions.tokenCreationChecking>) => {
            this.router.navigate(['/use-cases/setup-token/manage-token'], {
              queryParams: { chainId: action.chainId, txnHash: action.txn }
            });
          }),
          catchError(() =>
            of(
              tokenActions.createTokenFailure({
                errorMessage: $localize`:@@tokenManagement.tokenCreationFailure:Token creation failed. Please try again.`
              })
            )
          )
        );
      })
    );
  });

  deployTokenCreationChecking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.tokenCreationChecking),
      concatLatestFrom(() => [this.store.select(selectTokenCreationRefreshCheck)]),
      filter((payload) => payload[1].data.attempt <= environment.contracts.token_setup.maxAttempt),
      delay(environment.contracts.token_setup.attemptTimeout * 1000 * 60),
      map(
        (payload: [ReturnType<typeof tokenActions.tokenCreationChecking>, StoreState<{ attempt: number }>]) =>
          payload as [ReturnType<typeof tokenActions.tokenCreationChecking>, StoreState<{ attempt: number }>]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.tokenCreationChecking>, StoreState<{ attempt: number }>]) => {
        return from(this.tokenSetupService.getCustomERC20FromTxnHash(action[0].chainId, action[0].txn)).pipe(
          map((response: ITokenSetup) =>
            tokenActions.tokenCreationCheckingSuccess({ token: response, txn: action[0].txn })
          ),
          catchError((error: { message: string }) =>
            of(tokenActions.tokenCreationCheckingFailure({ message: error.message, txn: action[0].txn }))
          )
        );
      })
    );
  });

  loadTokenByTxnHash$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.loadTokenByTxnHash),
      switchMap((action: ReturnType<typeof tokenActions.loadTokenByTxnHash>) => {
        return from(this.tokenSetupService.getCustomERC20FromTxnHash(action.chainId, action.txHash as string)).pipe(
          map((token: ITokenSetup) => tokenActions.loadTokenByTxnHashSuccess({ token })),
          catchError((error: { message: string }) =>
            of(tokenActions.loadTokenByTxnHashFailure({ message: error.message }))
          )
        );
      })
    );
  });

  loadTokenByContractAddress$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.loadTokenByContractAddress),
      switchMap((action: ReturnType<typeof tokenActions.loadTokenByContractAddress>) => {
        return from(
          this.tokenSetupService.getCustomERC20FromContractAddress(action.chainId, action.contractAddress)
        ).pipe(
          map((token: ITokenSetup) => tokenActions.loadTokenByContractAddressSuccess({ token })),
          catchError((error: { message: string }) =>
            of(tokenActions.loadTokenByContractAddressFailure({ message: error.message }))
          )
        );
      })
    );
  });

  mintToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.mintToken),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokenDetailData)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [ReturnType<typeof tokenActions.mintToken>, WalletProvider | null, string | null, ITokenSetup | null]
        ) => payload as [ReturnType<typeof tokenActions.mintToken>, WalletProvider, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.mintToken>, WalletProvider, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.mintToken(
            action[2],
            action[0].to,
            action[0].amount,
            action[3].contractAddress,
            action[3].chainId
          )
        ).pipe(
          map((response: IReceiptTransaction) =>
            tokenActions.mintTokenSuccess({ txn: response.blockHash, chainId: action[3].chainId })
          ),
          catchError((error: { message: string }) => of(tokenActions.mintTokenFailure({ message: error.message })))
        );
      })
    );
  });

  burnToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.burnToken),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokenDetailData)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [ReturnType<typeof tokenActions.burnToken>, WalletProvider | null, string | null, ITokenSetup | null]
        ) => payload as [ReturnType<typeof tokenActions.burnToken>, WalletProvider, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.burnToken>, WalletProvider, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.burnToken(action[2], action[0].amount, action[3].contractAddress, action[3].chainId)
        ).pipe(
          map((response: IReceiptTransaction) =>
            tokenActions.burnTokenSuccess({ txn: response.blockHash, chainId: action[3].chainId })
          ),
          catchError((error: { message: string }) => of(tokenActions.burnTokenFailure({ message: error.message })))
        );
      })
    );
  });

  togglePauseToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.togglePauseToken),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokenDetailData)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [
            ReturnType<typeof tokenActions.togglePauseToken>,
            WalletProvider | null,
            string | null,
            ITokenSetup | null
          ]
        ) => payload as [ReturnType<typeof tokenActions.togglePauseToken>, WalletProvider, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.togglePauseToken>, WalletProvider, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.toggleTokenPause(
            action[2],
            action[3].contractAddress,
            action[3].chainId,
            action[0].pause
          )
        ).pipe(
          map((response: IReceiptTransaction) =>
            tokenActions.togglePauseTokenSuccess({ txn: response.blockHash, chainId: action[3].chainId })
          ),
          catchError((error: { message: string }) =>
            of(tokenActions.togglePauseTokenFailure({ message: error.message }))
          )
        );
      })
    );
  });

  transferToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.transferToken),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokenDetailData)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [
            ReturnType<typeof tokenActions.transferToken>,
            WalletProvider | null,
            string | null,
            ITokenSetup | null
          ]
        ) => payload as [ReturnType<typeof tokenActions.transferToken>, WalletProvider, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.transferToken>, WalletProvider, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.transferToken(
            action[2],
            action[0].to,
            action[0].amount,
            action[3].contractAddress,
            action[3].chainId
          )
        ).pipe(
          map((response: IReceiptTransaction) =>
            tokenActions.transferTokenSuccess({ txn: response.blockHash, chainId: action[3].chainId })
          ),
          catchError((error: { message: string }) => of(tokenActions.transferTokenFailure({ message: error.message })))
        );
      })
    );
  });

  renounceOwnership$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.renounceOwnership),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokenDetailData)
      ]),
      tap(console.log),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [
            ReturnType<typeof tokenActions.renounceOwnership>,
            WalletProvider | null,
            string | null,
            ITokenSetup | null
          ]
        ) => payload as [ReturnType<typeof tokenActions.renounceOwnership>, WalletProvider, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.renounceOwnership>, WalletProvider, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.renounceTokenOwnership(action[2], action[3].contractAddress, action[3].chainId)
        ).pipe(
          map((response: IReceiptTransaction) =>
            tokenActions.renounceOwnershipSuccess({ txn: response.blockHash, chainId: action[3].chainId })
          ),
          catchError((error: { message: string }) =>
            of(tokenActions.renounceOwnershipFailure({ message: error.message }))
          )
        );
      })
    );
  });

  changeOwnership$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenActions.changeOwnership),
      concatLatestFrom(() => [
        this.store.select(selectWalletConnected),
        this.store.select(selectPublicAddress),
        this.store.select(selectTokenDetailData)
      ]),
      filter((payload) => payload[1] !== null && payload[2] !== null && payload[3] !== null),
      map(
        (
          payload: [
            ReturnType<typeof tokenActions.changeOwnership>,
            WalletProvider | null,
            string | null,
            ITokenSetup | null
          ]
        ) => payload as [ReturnType<typeof tokenActions.changeOwnership>, WalletProvider, string, ITokenSetup]
      ),
      switchMap((action: [ReturnType<typeof tokenActions.changeOwnership>, WalletProvider, string, ITokenSetup]) => {
        return from(
          this.tokenSetupService.transferTokenOwnership(
            action[2],
            action[0].to,
            action[3].contractAddress,
            action[3].chainId
          )
        ).pipe(
          map((response: IReceiptTransaction) =>
            tokenActions.changeOwnershipSuccess({ txn: response.blockHash, chainId: action[3].chainId })
          ),
          catchError((error: { message: string }) =>
            of(tokenActions.changeOwnershipFailure({ message: error.message }))
          )
        );
      })
    );
  });
}
