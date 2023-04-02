import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import { AccountService } from '../../../shared/services/account/account.service';
import { showErrorNotification, showSuccessNotification } from '../../notification-store/state/actions';
import { IOrganization, IProfileAdded } from './../../../shared/interfaces';
import { AuthService } from './../../../shared/services/auth/auth.service';
import * as AuthActions from './actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private authService: AuthService,
    private web3LoginService: Web3LoginService
  ) {}

  loadAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadAuth),
      filter(() => !!this.authService.getPublicAddress()),
      mergeMap(
        (): Actions =>
          this.accountService
            .getAccountByPublicAddressAndOrganization(this.authService.getPublicAddress() as string)
            .pipe(
              mergeMap(
                (
                  response: ApolloQueryResult<{
                    memberAccountSaveds: IProfileAdded[];
                    organizationSaveds: IOrganization[];
                  }>
                ) => {
                  switch (true) {
                    case response.data.memberAccountSaveds.length > 0 && response.data.organizationSaveds.length > 0:
                      return [
                        AuthActions.loadAuthSuccess({
                          auth: response.data.memberAccountSaveds[0]
                        }),
                        AuthActions.loadOrgnisationSuccess({
                          organization: response.data.organizationSaveds[0]
                        })
                      ];
                    case response.data.memberAccountSaveds.length == 0 && response.data.organizationSaveds.length > 0:
                      return [
                        AuthActions.loadAuthFailure({ message: 'User not found' }),
                        AuthActions.loadOrgnisationSuccess({
                          organization: response.data.organizationSaveds[0]
                        })
                      ];
                    default:
                      return [AuthActions.loadAuthFailure({ message: 'User not found' })];
                  }
                }
              ),
              catchError(() => of(AuthActions.loadAuthFailure({ message: 'Error loading auth' })))
            )
      )
    );
  });

  setAuthPublicAddress$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.setAuthPublicAddress),
        tap((action: { publicAddress: string; networkId: string; networkName: string }) => {
          this.authService.savePublicAddress(action.publicAddress);
          this.authService.saveNetworkId(action.networkId);
        })
      );
    },
    { dispatch: false }
  );

  addressChecking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.addressChecking),
      filter(() => !!this.authService.getPublicAddress() && !!this.authService.getNetworkId()),
      map(() => {
        const networkId: string = this.authService.getNetworkId() as string;
        return AuthActions.setAuthPublicAddress({
          publicAddress: this.authService.getPublicAddress() as string,
          networkId: networkId,
          networkName: this.web3LoginService.getNetworkName(networkId)
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
          this.authService.removeNetworkId();
        })
      );
    },
    { dispatch: false }
  );

  errorAccountTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.editAccountFailure, AuthActions.addAccountFailure, AuthActions.deleteAccountFailure),
      map((action: { message: string }) => showErrorNotification({ message: action.message }))
    );
  });

  successAccountTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.editAccountSuccess, AuthActions.addAccountSuccess, AuthActions.deleteAccountSuccess),
      filter((action: { numberConfirmation: number }) => action.numberConfirmation == 1),
      map(() => showSuccessNotification({ message: 'Transaction is processing' }))
    );
  });
}
