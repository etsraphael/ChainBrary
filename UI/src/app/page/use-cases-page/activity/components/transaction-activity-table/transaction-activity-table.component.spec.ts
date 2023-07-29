import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { TransactionActivityTableComponent } from './transaction-activity-table.component';

describe('TransactionActivityTableComponent', () => {
  let component: TransactionActivityTableComponent;
  let fixture: ComponentFixture<TransactionActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedTestModule],
      declarations: [TransactionActivityTableComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
