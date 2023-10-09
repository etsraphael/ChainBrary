import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NetworkServiceWeb3Login } from '../../network/network.service';
import { BaseProviderService } from './base-provider.service';

describe('BaseProviderService', () => {
  let service: BaseProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        NetworkServiceWeb3Login,
        { provide: 'config', useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    service = TestBed.inject(BaseProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
