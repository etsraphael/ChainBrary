import { mock } from 'ts-mockito';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

export const storeMock = mock(Store) as Store<object>;
export const snackbarMock = mock(MatSnackBar);
export const dialogMock = mock(MatDialog);
export const routeMock = mock(ActivatedRoute);
export const routerMock = mock(Router);
