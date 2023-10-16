import { Injectable } from '@angular/core';
import { WalletProvider, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs';
import { showErrorNotification, showSuccessNotification } from '../../notification-store/state/actions';
import { AuthService } from './../../../shared/services/auth/auth.service';
import * as AuthActions from './actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private web3LoginService: Web3LoginService
  ) {}

  setAuthPublicAddress$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.setAuthPublicAddress),
        tap((action: ReturnType<typeof AuthActions.setAuthPublicAddress>) => {
          this.authService.saveWalletConnected({
            publicAddress: action.publicAddress,
            network: action.network,
            walletProvider: action.wallet
          });
          this.web3LoginService.closeLoginModal();
        })
      );
    },
    { dispatch: false }
  );

  addressChecking$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.addressChecking),
        filter(() => !!this.authService.getRecentWallet()),
        map(() => {
          const recentWallet = this.authService.getRecentWallet() as WalletProvider;
          this.web3LoginService.retreiveWalletProvider(recentWallet);
        })
      );
    },
    { dispatch: false }
  );

  resetAuth$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.resetAuth),
        tap(() => {
          this.authService.removePublicAddress();
          this.authService.removechainId();
        })
      );
    },
    { dispatch: false }
  );

  errorAccountTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.addAccountFailure, AuthActions.deleteAccountFailure),
      map((action: { message: string }) => showErrorNotification({ message: action.message }))
    );
  });

  successAccountTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.addAccountSuccess, AuthActions.deleteAccountSuccess),
      filter((action: { numberConfirmation: number }) => action.numberConfirmation == 1),
      map(() => showSuccessNotification({ message: 'Transaction is processing' }))
    );
  });

  networkChangeSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.networkChangeSuccess),
      tap((action: ReturnType<typeof AuthActions.networkChangeSuccess>) => {
        this.authService.savechainId(action.network.chainId);
      }),
      map(() => showSuccessNotification({ message: 'Network is updated' }))
    );
  });

  networkChangeError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.networkChangeFailure),
      map((action: ReturnType<typeof AuthActions.networkChangeFailure>) =>
        showErrorNotification({ message: action.message })
      )
    );
  });

  addNetworkToWallet$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.addNetworkToWallet),
      switchMap(async (action: ReturnType<typeof AuthActions.addNetworkToWallet>) => {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: action.network.networkVersion,
                chainName: action.network.name,
                rpcUrls: action.network.rpcUrls,
                nativeCurrency: action.network.nativeCurrency,
                blockExplorerUrls: [action.network.blockExplorerUrls]
              }
            ]
          });
          return AuthActions.addNetworkToWalletSuccess({ network: action.network });
        } catch (error: unknown) {
          const errorPayload = error as { code: number; message: string };
          return AuthActions.addNetworkToWalletFailure({
            message: errorPayload.message || 'An unexpected error occurred'
          });
        }
      })
    );
  });

  networkChanges$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.networkChange),
      switchMap(async (action: ReturnType<typeof AuthActions.networkChange>) => {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: action.network.chainId }]
          });
          return AuthActions.networkChangeSuccessOutside();
        } catch (error: unknown) {
          const errorPayload = error as { code: number; message: string };
          if (errorPayload.code === 4902) {
            return AuthActions.addNetworkToWallet({ network: action.network });
          } else {
            return AuthActions.networkChangeFailure({
              message: errorPayload.message || 'An unexpected error occurred'
            });
          }
        }
      })
    );
  });

  accountChanged$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.accountChanged),
        filter((action: ReturnType<typeof AuthActions.accountChanged>) => !!action.publicAddress),
        tap((action: ReturnType<typeof AuthActions.accountChanged>) =>
          this.authService.savePublicAddress(action.publicAddress as string)
        )
      );
    },
    { dispatch: false }
  );

  logOutFromWallet$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.accountChanged),
      filter((action: ReturnType<typeof AuthActions.accountChanged>) => !action.publicAddress),
      map(() => AuthActions.resetAuth())
    );
  });
}
