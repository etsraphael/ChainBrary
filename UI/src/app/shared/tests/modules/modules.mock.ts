import { mock } from 'ts-mockito';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

export const storeMock = mock(Store);
export const snackbarMock = mock(MatSnackBar);
