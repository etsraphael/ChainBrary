import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayNowSuccessfulPageComponent } from './pay-now-successful-page.component';

describe('PayNowSuccessfulPageComponent', () => {
  let component: PayNowSuccessfulPageComponent;
  let fixture: ComponentFixture<PayNowSuccessfulPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayNowSuccessfulPageComponent]
    });
    fixture = TestBed.createComponent(PayNowSuccessfulPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
