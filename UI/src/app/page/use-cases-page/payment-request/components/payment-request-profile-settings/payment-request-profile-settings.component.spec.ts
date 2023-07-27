import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialModule } from './../../../../../module/material.module';
import { PaymentRequestProfileSettingsComponent } from './payment-request-profile-settings.component';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';

describe('PaymentRequestProfileSettingsComponent', () => {
  let component: PaymentRequestProfileSettingsComponent;
  let fixture: ComponentFixture<PaymentRequestProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule],
      declarations: [PaymentRequestProfileSettingsComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
