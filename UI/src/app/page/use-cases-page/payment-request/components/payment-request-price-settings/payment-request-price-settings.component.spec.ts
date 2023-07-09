import '@angular/compiler';
import '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { PaymentRequestPriceSettingsComponent } from './payment-request-price-settings.component';

describe('PaymentRequestPriceSettingsComponent', () => {
  const component: PaymentRequestPriceSettingsComponent = new PaymentRequestPriceSettingsComponent()

  it('should create PaymentRequestPriceSettingsComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should have priceForm initialized correctly', () => {
    component.priceForm = new FormGroup({
      description: new FormControl<string | null>(null),
      amount: new FormControl<number | null>(null),
      usdEnabled: new FormControl<boolean | null>(null),
    });

    expect(component.priceForm).toBeInstanceOf(FormGroup);
  });

  it('should have networkSymbol initialized correctly', () => {
    expect(component.networkSymbol).toBeNull();
    component.networkSymbol = 'MockedSymbol';
    expect(typeof component.networkSymbol).toBe('string');
  });

  it('should have usdConversionRate initialized correctly', () => {
    expect(component.usdConversionRate).toBeNull();
    component.usdConversionRate = 10;
    expect(typeof component.usdConversionRate).toBe('number');
  });

  it('should have tokenConversionRate initialized correctly', () => {
    expect(component.tokenConversionRate).toBeNull();
    component.tokenConversionRate = 15;
    expect(typeof component.tokenConversionRate).toBe('number');
  });

  it('should emit goToNextPage event', () => {
    const emitSpy = vi.spyOn(component.goToNextPage, 'emit');
    component.goToNextPage.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit goToPreviousPage event', () => {
    const emitSpy = vi.spyOn(component.goToPreviousPage, 'emit');
    component.goToPreviousPage.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit swapCurrency event', () => {
    const emitSpy = vi.spyOn(component.swapCurrency, 'emit');
    component.swapCurrency.emit();
    expect(emitSpy).toHaveBeenCalled();
  });
});
