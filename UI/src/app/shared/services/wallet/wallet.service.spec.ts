import { TestBed } from '@angular/core/testing';
import { WalletService } from './wallet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    service = TestBed.inject(WalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
