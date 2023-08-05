import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../../components/shared-components.module';
import { Web3EventsService } from './web3-events.service';

describe('Web3EventsService', () => {
  let service: Web3EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SharedTestModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    service = TestBed.inject(Web3EventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
