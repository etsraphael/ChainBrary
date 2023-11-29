import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { BidWithdrawalComponent } from './bid-withdrawal.component';
import { StoreModule } from '@ngrx/store';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as bidInitialState } from './../../../../../../store/bid-store/state/init';

describe('BidWithdrawalComponent', () => {
  let component: BidWithdrawalComponent;
  let fixture: ComponentFixture<BidWithdrawalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState,
          bid: () => bidInitialState
        }),
        SharedTestModule
      ],
      declarations: [BidWithdrawalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(BidWithdrawalComponent);
    component = fixture.componentInstance;

    component.bidResult = {
      total: 10,
      fee: 10 * 0.001,
      net: 10 - 10 * 0.001
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
