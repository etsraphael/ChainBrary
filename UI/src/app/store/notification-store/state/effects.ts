import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import * as NotificationActions from './actions';

@Injectable()
export class NotificationEffects {
  constructor(private actions$: Actions, private _snackBar: MatSnackBar) {}

  successNotification$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NotificationActions.showSuccessNotification),
        map((action: { message: string }) =>
          this._snackBar.open(action.message, 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
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
        map((action: { message: string }) =>
          this._snackBar.open(action.message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          })
        )
      );
    },
    { dispatch: false }
  );
}