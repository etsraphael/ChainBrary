import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestMakerComponent } from './payment-request-maker.component';

describe('PaymentRequestMakerComponent', () => {
  let component: PaymentRequestMakerComponent;
  let fixture: ComponentFixture<PaymentRequestMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentRequestMakerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
