import { mock } from 'ts-mockito';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

export const storeMock = mock(Store);
export const snackbarMock = mock(MatSnackBar);
export const dialogMock = mock(MatDialog);
