import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawTokenPageContainerComponent } from './withdraw-token-page-container.component';

describe('WithdrawTokenPageContainerComponent', () => {
  let component: WithdrawTokenPageContainerComponent;
  let fixture: ComponentFixture<WithdrawTokenPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawTokenPageContainerComponent]
    });
    fixture = TestBed.createComponent(WithdrawTokenPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
