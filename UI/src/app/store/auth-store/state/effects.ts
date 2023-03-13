import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApolloQueryResult } from '@apollo/client/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import { AccountService } from '../services/account/account.service';
import { IProfileAdded } from './../../../shared/interfaces';
import { AuthService } from './../../../shared/services/auth/auth.service';
import * as AuthActions from './actions';
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  loadAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadAuth),
      filter(() => !!this.authService.getPublicAddress()),
      mergeMap(() =>
        this.accountService.getAccountByPublicAddress(this.authService.getPublicAddress() as string).pipe(
          map((response: ApolloQueryResult<{ memberAccountSaveds: IProfileAdded[] }>) => {
            if (response.data.memberAccountSaveds.length > 0) {
              return AuthActions.loadAuthSuccess({ auth: response.data.memberAccountSaveds[0] });
            } else {
              return AuthActions.loadAuthFailure({ message: 'User not found' });
            }
          }),
          catchError(() => of(AuthActions.loadAuthFailure({ message: 'Error loading auth' })))
        )
      )
    );
  });

  setAuthPublicAddress$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.setAuthPublicAddress),
        tap((action: { publicAddress: string }) => this.authService.savePublicAddress(action.publicAddress))
      );
    },
    { dispatch: false }
  );

  addressChecking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.addressChecking),
      filter(() => !!this.authService.getPublicAddress()),
      map(() => AuthActions.setAuthPublicAddress({ publicAddress: this.authService.getPublicAddress() as string }))
    );
  });

  resetAuth$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.resetAuth),
        map(() => this.authService.removePublicAddress())
      );
    },
    { dispatch: false }
  );

  addAccountError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.addAccountFailure),
        map((action: { message: string }) => this._snackBar.open(action.message, 'Close', { duration: 2000 }))
      );
    },
    { dispatch: false }
  );
}
