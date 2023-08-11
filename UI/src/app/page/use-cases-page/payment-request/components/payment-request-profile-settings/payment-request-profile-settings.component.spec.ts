import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentRequestProfileSettingsComponent } from './payment-request-profile-settings.component';
import { snackbarMock } from 'src/app/shared/tests/modules/modules.mock';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileForm } from 'src/app/shared/interfaces';

describe('PaymentRequestProfileSettingsComponent', () => {
  const component: PaymentRequestProfileSettingsComponent = new PaymentRequestProfileSettingsComponent(
    snackbarMock
  );

  beforeEach(() => {
    component.profileForm = new FormGroup<ProfileForm>({
      publicAddress: new FormControl('', []),
      avatarUrl: new FormControl('', []),
      username: new FormControl('', [])
    });
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit goToNextPage when form is invalid', () => {
    const spyOnEmit = vi.spyOn(component.goToNextPage, 'emit');
    component.profileForm.controls['publicAddress'].setErrors({ incorrect: true });

    component.submitForm();

    expect(spyOnEmit).not.toHaveBeenCalled();
  });

  it('should emit goToNextPage when form is valid', () => {
    const spyOnEmit = vi.spyOn(component.goToNextPage, 'emit');

    component.profileForm.setValue({
      publicAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      avatarUrl: 'https://example.com/fake-avatar.jpg',
      username: 'John'
    });

    component.submitForm();

    expect(spyOnEmit).toHaveBeenCalled();
  });
});
