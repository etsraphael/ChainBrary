import '@angular/compiler';
import '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { PaymentRequestProfileSettingsComponent } from './payment-request-profile-settings.component';
import { snackbarMock } from 'src/app/shared/tests/mocks/modules';
import { deepEqual } from 'ts-mockito';

describe('PaymentRequestProfileSettingsComponent', () => {
  const component: PaymentRequestProfileSettingsComponent = new PaymentRequestProfileSettingsComponent(snackbarMock)

  it('should create PaymentRequestProfileSettingsComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should have priceForm initialized correctly', () => {
    component.profileForm = new FormGroup({
      publicAddress: new FormControl<string | null>(null),
      avatarUrl: new FormControl<string | null>(null),
      username: new FormControl<string | null>(null),
    });

    expect(component.profileForm).toBeInstanceOf(FormGroup);
  });

  it('should not emit goToNextPage when form is invalid', () => {
    const emitSpy = vi.spyOn(component.goToNextPage, 'emit');
    component.profileForm.setErrors({});
    component.submitForm();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit goToNextPage when form is valid', () => {
    const snackbarOpenSpy = vi.spyOn(snackbarMock, 'open');
    const emitSpy = vi.spyOn(component.goToNextPage, 'emit');

    component.profileForm.setValue({
      publicAddress: 'MockedAddress',
      avatarUrl: 'MockedAvatar',
      username: 'Jane'
    });

    component.submitForm();

    expect(snackbarOpenSpy).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });
});
