import { Injectable } from '@angular/core';
import { INetworkDetail, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap } from 'rxjs';
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
        tap((action: { publicAddress: string; network: INetworkDetail }) => {
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

  networkChanged$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.networkChanged),
        tap((action: { network: INetworkDetail }) => {
          this.authService.savechainId(action.network.chainId);
        })
      );
    },
    { dispatch: false }
  );

  accountChanged$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.accountChanged),
        tap((action: { publicAddress: string | null }) => {
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
