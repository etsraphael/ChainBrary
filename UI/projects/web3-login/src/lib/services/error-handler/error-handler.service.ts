import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  durationInSeconds = 4;

  constructor(private _snackBar: MatSnackBar) {}

  showSnackBar(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000
    });
  }
}
