import { mock } from 'ts-mockito';
import { Action, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';

// These values are the mocks for the various modules used in our components.
// These mocks make it possible to use the modules without having to mock the prerequisites.

export const storeMock = mock(Store) as Store<object>;
export const snackbarMock = mock(MatSnackBar);
export const dialogMock = mock(MatDialog);
export const actionMock = mock(Actions) as Actions<Action>;
export const routeMock = mock(ActivatedRoute);
export const routerMock = mock(Router);
