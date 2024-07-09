import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Web3LoginComponent, Web3LoginService } from '@chainbrary/web3-login';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { selectAuthStatus } from '../../auth-store/state/selectors';
import { TokenCreationModalComponent } from './../../../page/use-cases-page/pages/setup-token/components/token-creation-modal/token-creation-modal.component';
import { AuthStatusCode } from './../../../shared/enum';
import { createToken, deployToken, showTokenCreationModal } from './actions';

@Injectable()
export class TokenManagementEffects {
  constructor(
    private actions$: Actions,
    private web3LoginService: Web3LoginService,
    private dialog: MatDialog,
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
              map(() => showTokenCreationModal({ payload: action[0].payload }))
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
      map((action: [ReturnType<typeof createToken>, AuthStatusCode]) =>
        showTokenCreationModal({ payload: action[0].payload })
      )
    );
  });

  showTokenCreationModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(showTokenCreationModal),
      switchMap((action: ReturnType<typeof showTokenCreationModal>) => {
        const dialog: MatDialogRef<TokenCreationModalComponent> = this.dialog
          .open(TokenCreationModalComponent)
          .addPanelClass(['col-12', 'col-md-6']);
        return dialog.afterClosed().pipe(
          take(1),
          filter((response: { success: boolean }) => response.success),
          map(() => deployToken({ payload: action.payload }))
        );
      })
    );
  });
}
