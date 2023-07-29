import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { initialState as authInitialState } from './../../../../../store/auth-store/state/init';
import { TransactionActivityHeaderComponent } from '../../components/transaction-activity-header/transaction-activity-header.component';
import { TransactionActivityTableComponent } from '../../components/transaction-activity-table/transaction-activity-table.component';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { ActivityContainerComponent } from './activity-container.component';
import { initialState as transactionInitialState } from './../../../../../store/transaction-store/state/init';

describe('ActivityContainerComponent', () => {
  let component: ActivityContainerComponent;
  let fixture: ComponentFixture<ActivityContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState,
          transactions: () => transactionInitialState
        }),
        SharedTestModule
      ],
      declarations: [ActivityContainerComponent, TransactionActivityHeaderComponent, TransactionActivityTableComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
