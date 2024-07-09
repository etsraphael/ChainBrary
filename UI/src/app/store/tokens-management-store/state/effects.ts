import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { AuthStatusCode } from 'src/app/shared/enum';
import { selectAuthStatus } from '../../auth-store/state/selectors';
import { createToken } from './actions';

@Injectable()
export class TokenManagementEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private readonly store: Store,
    private router: Router
  ) {}

  createTokenWithoutConnection$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(createToken),
        concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
        filter(([, authStatus]) => authStatus === AuthStatusCode.NotConnected),
        tap(() => this.web3LoginService.openLoginModal())
      );
    },
    { dispatch: false }
  );
}
