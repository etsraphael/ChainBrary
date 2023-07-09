import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mock } from 'ts-mockito';
import { vi } from 'vitest';

export const dialogMock = mock(MatDialog);
export const snackbarMock = mock(MatSnackBar);
export const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
