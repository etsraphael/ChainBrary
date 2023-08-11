import { describe, expect, it } from 'vitest';
import { PaymentRequestPriceSettingsComponent } from './payment-request-price-settings.component';

describe('PaymentRequestPriceSettingsComponent', () => {
  const component: PaymentRequestPriceSettingsComponent = new PaymentRequestPriceSettingsComponent();

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
