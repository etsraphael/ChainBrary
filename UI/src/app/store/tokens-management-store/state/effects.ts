import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthStatusCode } from 'src/app/shared/enum';
import { selectAuthStatus } from '../../auth-store/state/selectors';
import { createToken, showTokenCreationModal } from './actions';

@Injectable()
export class TokenManagementEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private readonly store: Store
  ) {}

  createTokenWithoutConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createToken),
      concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
      filter(([, authStatus]) => authStatus === AuthStatusCode.NotConnected),
      switchMap(() => {
        const dialog: MatDialogRef<Web3LoginComponent> = this.web3LoginService.openLoginModal();
        return dialog.afterClosed().pipe(
          switchMap(() => {
            return this.web3LoginService.onWalletConnectedEvent$.pipe(map(() => showTokenCreationModal()));
          })
        );
      })
    );
  });

  createTokenWithConnection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createToken),
      concatLatestFrom(() => [this.store.select(selectAuthStatus)]),
      filter(([, authStatus]) => authStatus === AuthStatusCode.Connected),
      map(() => showTokenCreationModal())
    );
  });
}
