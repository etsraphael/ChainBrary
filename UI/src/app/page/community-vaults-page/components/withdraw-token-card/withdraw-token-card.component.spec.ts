import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawTokenCardComponent } from './withdraw-token-card.component';

describe('WithdrawTokenCardComponent', () => {
  let component: WithdrawTokenCardComponent;
  let fixture: ComponentFixture<WithdrawTokenCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawTokenCardComponent]
    });
    fixture = TestBed.createComponent(WithdrawTokenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
