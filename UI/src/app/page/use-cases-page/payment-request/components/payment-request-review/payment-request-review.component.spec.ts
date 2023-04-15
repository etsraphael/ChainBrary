import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestReviewComponent } from './payment-request-review.component';

describe('PaymentRequestReviewComponent', () => {
  let component: PaymentRequestReviewComponent;
  let fixture: ComponentFixture<PaymentRequestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRequestReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRequestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
