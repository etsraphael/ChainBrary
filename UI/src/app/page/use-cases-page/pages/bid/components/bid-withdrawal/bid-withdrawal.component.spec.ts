import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidWithdrawalComponent } from './bid-withdrawal.component';

describe('BidWithdrawalComponent', () => {
  let component: BidWithdrawalComponent;
  let fixture: ComponentFixture<BidWithdrawalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BidWithdrawalComponent]
    });
    fixture = TestBed.createComponent(BidWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
