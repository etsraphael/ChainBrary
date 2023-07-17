import { Injectable } from '@angular/core';
import { Web3LoginService } from '@chainbrary/web3-login';
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
          this.authService.savePublicAddress(action.publicAddress);
          this.authService.savechainId(action.network.chainId);
        })
      );
    },
    { dispatch: false }
  );

  addressChecking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.addressChecking),
      filter(() => !!this.authService.getPublicAddress() && !!this.authService.getchainId()),
      map(() => {
        const chainId: string = this.authService.getchainId() as string;
        return AuthActions.setAuthPublicAddress({
          publicAddress: this.authService.getPublicAddress() as string,
          network: this.web3LoginService.getNetworkDetailByChainId(chainId)
        });
      })
    );
  });

  resetAuth$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.resetAuth),
        map(() => {
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

  networkChanges$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.networkChange),
      switchMap(async (action: ReturnType<typeof AuthActions.networkChange>) => {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: action.network.chainCode }]
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
        tap((action: ReturnType<typeof AuthActions.accountChanged>) => {
          if (action.publicAddress) {
            this.authService.savePublicAddress(action.publicAddress);
          } else {
            this.authService.removePublicAddress();
          }
        })
      );
    },
    { dispatch: false }
  );
}
