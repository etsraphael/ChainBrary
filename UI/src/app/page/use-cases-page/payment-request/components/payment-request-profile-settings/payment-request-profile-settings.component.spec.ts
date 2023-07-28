import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { ProfileForm } from './../../../../../shared/interfaces';
import { PaymentRequestProfileSettingsComponent } from './payment-request-profile-settings.component';

describe('PaymentRequestProfileSettingsComponent', () => {
  let component: PaymentRequestProfileSettingsComponent;
  let fixture: ComponentFixture<PaymentRequestProfileSettingsComponent>;

  const profileForm: FormGroup<ProfileForm> = new FormGroup<ProfileForm>({
    publicAddress: new FormControl('', [Validators.required]),
    avatarUrl: new FormControl('', []),
    username: new FormControl('', [Validators.required, Validators.maxLength(20)])
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule, ReactiveFormsModule, BrowserAnimationsModule],
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
});
