import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PriceSettingsForm } from './../../../../../shared/interfaces';
import { PaymentRequestPriceSettingsComponent } from './payment-request-price-settings.component';

describe('PaymentRequestPriceSettingsComponent', () => {
  let component: PaymentRequestPriceSettingsComponent;
  let fixture: ComponentFixture<PaymentRequestPriceSettingsComponent>;

  const priceForm: FormGroup<PriceSettingsForm> = new FormGroup<PriceSettingsForm>({
    description: new FormControl('', []),
    amount: new FormControl(1, [Validators.required, Validators.min(0)]),
    usdEnabled: new FormControl(false, [])
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponentsModule, MaterialModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [PaymentRequestPriceSettingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestPriceSettingsComponent);
    component = fixture.componentInstance;
    component.priceForm = priceForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
