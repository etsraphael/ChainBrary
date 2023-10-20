import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BraveWalletProviderService } from './brave-wallet-provider.service';

describe('BraveWalletProviderService', () => {
  let service: BraveWalletProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'config', useValue: {} }
      ]
    });
    service = TestBed.inject(BraveWalletProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
