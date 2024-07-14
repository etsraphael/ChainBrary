import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletProvider, Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, delay, filter, map, switchMap, take } from 'rxjs/operators';
import { AbiFragment, Contract } from 'web3';
import { selectAuthStatus, selectPublicAddress } from '../../auth-store/state/selectors';
import { selectWalletConnected } from '../../global-store/state/selectors';
import { environment } from './../../../../environments/environment';
import { AuthStatusCode } from './../../../shared/enum';
import { ITokenSetup, StoreState } from './../../../shared/interfaces';
import { TokenSetupService } from './../../../shared/services/token-setup/token-setup.service';
import {
  createToken,
  createTokenFailure,
  deployToken,
  tokenCreationChecking,
  tokenCreationCheckingFailure,
  tokenCreationCheckingSuccess
} from './actions';
import { selectTokenCreationRefreshCheck } from './selectors';

@Injectable()
export class TokenManagementEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private tokenSetupService: TokenSetupService,
    private readonly store: Store
  ) {}

  createTokenWithoutConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createToken),
      concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
      filter(([, authStatus]) => authStatus === AuthStatusCode.NotConnected),
      switchMap((action: [ReturnType<typeof createToken>, AuthStatusCode]) => {
        const dialog: MatDialogRef<Web3LoginComponent> = this.web3LoginService.openLoginModal();
        return dialog.afterClosed().pipe(
          switchMap(() =>
            this.web3LoginService.onWalletConnectedEvent$.pipe(
              take(1),
              map(() => deployToken({ payload: action[0].payload }))
            )
          )
        );
      })
    );
  });

  createTokenWithConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createToken),
      concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
      filter(([, authStatus]) => authStatus === AuthStatusCode.Connected),
      map((action: [ReturnType<typeof createToken>, AuthStatusCode]) => deployToken({ payload: action[0].payload }))
    );
  });

  deployToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deployToken),
      concatLatestFrom(() => [this.store.select(selectWalletConnected), this.store.select(selectPublicAddress)]),
      filter((payload) => payload[1] !== null && payload[2] !== null),
      map(
        (payload: [ReturnType<typeof deployToken>, WalletProvider | null, string | null]) =>
          payload as [ReturnType<typeof deployToken>, WalletProvider, string]
      ),
      switchMap((action: [ReturnType<typeof deployToken>, WalletProvider, string]) => {
        return from(this.tokenSetupService.deployCustomERC20TokenContract(action[2], action[0].payload)).pipe(
          map((response: { contract: Contract<AbiFragment[]>; transactionHash: string }) =>
            tokenCreationChecking({ txn: response.transactionHash, chainId: action[0].payload.network })
          ),
          // tap((action: ReturnType<typeof BidActions.bidCreationChecking>) => {
          //   this.router.navigate(['/use-cases/bid/search/', action.txn]);
          // }),
          catchError(() =>
            of(
              createTokenFailure({
                message: $localize`:@@tokenManagement.tokenCreationFailure:Token creation failed. Please try again.`
              })
            )
          )
        );
      })
    );
  });

  deployTokenCreationChecking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tokenCreationChecking),
      concatLatestFrom(() => [this.store.select(selectTokenCreationRefreshCheck)]),
      filter((payload) => payload[1].data.attempt <= environment.contracts.token_setup.maxAttempt),
      delay(environment.contracts.token_setup.attemptTimeout * 1000 * 60),
      map(
        (payload: [ReturnType<typeof tokenCreationChecking>, StoreState<{ attempt: number }>]) =>
          payload as [ReturnType<typeof tokenCreationChecking>, StoreState<{ attempt: number }>]
      ),
      switchMap((action: [ReturnType<typeof tokenCreationChecking>, StoreState<{ attempt: number }>]) => {
        return from(this.tokenSetupService.getCustomERC20FromTxnHash(action[0].chainId, action[0].txn)).pipe(
          map((response: ITokenSetup) => tokenCreationCheckingSuccess({ token: response, txn: action[0].txn })),
          catchError((error: { message: string }) =>
            of(tokenCreationCheckingFailure({ message: error.message, txn: action[0].txn }))
          )
        );
      })
    );
  });
}
