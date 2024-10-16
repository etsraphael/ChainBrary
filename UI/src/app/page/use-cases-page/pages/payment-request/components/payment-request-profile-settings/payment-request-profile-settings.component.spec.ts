import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../../../../../module/material.module';
import {
  SharedComponentsModule,
  SharedTestModule
} from './../../../../../../shared/components/shared-components.module';
import { ProfileForm } from './../../../../../../shared/interfaces';
import { PaymentRequestProfileSettingsComponent } from './payment-request-profile-settings.component';

describe('PaymentRequestProfileSettingsComponent', () => {
  let component: PaymentRequestProfileSettingsComponent;
  let fixture: ComponentFixture<PaymentRequestProfileSettingsComponent>;

  const profileForm: FormGroup<ProfileForm> = new FormGroup<ProfileForm>({
    publicAddress: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.maxLength(20)])
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule, ReactiveFormsModule, BrowserAnimationsModule, SharedTestModule],
      declarations: [PaymentRequestProfileSettingsComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestProfileSettingsComponent);
    component = fixture.componentInstance;
    component.profileForm = profileForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have priceForm initialized correctly', () => {
    expect(component.profileForm).toBeInstanceOf(FormGroup);
  });

  it('should not emit goToNextPage when form is invalid', () => {
    const emitSpy = spyOn(component.goToNextPage, 'emit');
    component.profileForm.controls.publicAddress.setErrors({ incorrect: true });
    component.submitForm();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit goToNextPage when form is valid', () => {
    const emitSpy = spyOn(component.goToNextPage, 'emit');

    component.profileForm.setValue({
      publicAddress: 'MockedAddress',
      username: 'Jane'
    });

    component.submitForm();

    expect(emitSpy).toHaveBeenCalled();
  });
});
