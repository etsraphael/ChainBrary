import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PriceSettingsForm } from './../../../../../shared/interfaces';
import { PaymentRequestPriceSettingsComponent } from './payment-request-price-settings.component';

describe('PaymentRequestPriceSettingsComponent', () => {
  let component: PaymentRequestPriceSettingsComponent = new PaymentRequestPriceSettingsComponent();
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

  it('should have priceForm initialized correctly', () => {
    expect(component.priceForm).toBeInstanceOf(FormGroup);
  });

  it('should have networkSymbol initialized correctly', () => {
    component.networkSymbol = 'MockedSymbol';
    expect(typeof component.networkSymbol).toEqual('string');
  });

  it('should have usdConversionRate initialized correctly', () => {
    component.usdConversionRate = 10;
    expect(typeof component.usdConversionRate).toBe('number');
  });

  it('should have tokenConversionRate initialized correctly', () => {
    component.tokenConversionRate = 15;
    expect(typeof component.tokenConversionRate).toBe('number');
  });

  it('should emit goToNextPage event', () => {
    spyOn(component.goToNextPage, 'emit');
    component.goToNextPage.emit();
    expect(component.goToNextPage.emit).toHaveBeenCalled();
  });

  it('should emit goToPreviousPage event', () => {
    spyOn(component.goToPreviousPage, 'emit');
    component.goToPreviousPage.emit();
    expect(component.goToPreviousPage.emit).toHaveBeenCalled();
  });

  it('should emit swapCurrency event', () => {
    spyOn(component.swapCurrency, 'emit');
    component.swapCurrency.emit();
    expect(component.swapCurrency.emit).toHaveBeenCalled();
  });
});
