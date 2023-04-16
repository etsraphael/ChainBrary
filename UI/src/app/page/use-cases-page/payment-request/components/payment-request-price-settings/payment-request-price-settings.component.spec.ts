import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestPriceSettingsComponent } from './payment-request-price-settings.component';

describe('PaymentRequestPriceSettingsComponent', () => {
  let component: PaymentRequestPriceSettingsComponent;
  let fixture: ComponentFixture<PaymentRequestPriceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentRequestPriceSettingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestPriceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
