import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestContainerComponent } from './payment-request-container.component';

describe('PaymentRequestContainerComponent', () => {
  let component: PaymentRequestContainerComponent;
  let fixture: ComponentFixture<PaymentRequestContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentRequestContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
