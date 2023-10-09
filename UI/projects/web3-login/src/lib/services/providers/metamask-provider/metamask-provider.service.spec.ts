import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MetamaskProviderService } from './metamask-provider.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('MetamaskProviderService', () => {
  let service: MetamaskProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'config', useValue: {} }
      ]
    });
    service = TestBed.inject(MetamaskProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
