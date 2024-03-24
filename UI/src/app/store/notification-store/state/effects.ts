import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { LoadingScreenComponent } from './../../../shared/components/loading-screen/loading-screen.component';
import * as NotificationActions from './actions';

@Injectable()
export class NotificationEffects {
  private loadingDialogRef: MatDialogRef<LoadingScreenComponent> | null = null;

  constructor(
    private actions$: Actions,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  showLoadingScreen$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationActions.showLoadingScreen),
        map(() => {
          this.loadingDialogRef = this.dialog.open(LoadingScreenComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'fullscreen-dialog',
            disableClose: true
          });
        })
      );
    },
    { dispatch: false }
  );

  hideLoadingScreen$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationActions.hideLoadingScreen),
        map(() => {
          if (this.loadingDialogRef) {
            this.loadingDialogRef.close();
            this.loadingDialogRef = null;
          }
        })
      );
    },
    { dispatch: false }
  );

  successNotification$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationActions.showSuccessNotification),
        map((action: ReturnType<typeof NotificationActions.showSuccessNotification>) =>
          this._snackBar.open(action.message, '', {
            duration: 5000,
            panelClass: ['success-snackbar', 'text-center']
          })
        )
      );
    },
    { dispatch: false }
  );

  errorNotification$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationActions.showErrorNotification),
        map((action: ReturnType<typeof NotificationActions.showErrorNotification>) =>
          this._snackBar.open(action.message, $localize`:@@commonWords:Close`, {
            duration: 5000,
            panelClass: ['error-snackbar']
          })
        )
      );
    },
    { dispatch: false }
  );
}
