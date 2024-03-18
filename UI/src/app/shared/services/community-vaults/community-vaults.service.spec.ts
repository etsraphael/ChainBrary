import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SharedTestModule } from '../../components/shared-components.module';
import { CommunityVaultsService } from './community-vaults.service';

describe('CommunityVaultsService', () => {
  let service: CommunityVaultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    });
    service = TestBed.inject(CommunityVaultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
