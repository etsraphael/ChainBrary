import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Web3LoginService } from './web3-login.service';
import { SharedTestModule } from './../../../../../../src/app/shared/components/shared-components.module';

describe('Web3LoginService', () => {
  let service: Web3LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    service = TestBed.inject(Web3LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
