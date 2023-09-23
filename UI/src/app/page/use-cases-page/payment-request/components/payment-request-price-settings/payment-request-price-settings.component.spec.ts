import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NetworkChainId } from '@chainbrary/web3-login';
import { of } from 'rxjs';
import {
  currentNetworkSample,
  paymentConversionStoreSample,
  tokenSample
} from './../../../../../../../tests/samples/network';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PriceSettingsForm } from './../../../../../shared/interfaces';
import { PaymentRequestPriceSettingsComponent } from './payment-request-price-settings.component';

describe('PaymentRequestPriceSettingsComponent', () => {
  let component: PaymentRequestPriceSettingsComponent = new PaymentRequestPriceSettingsComponent();
  let fixture: ComponentFixture<PaymentRequestPriceSettingsComponent>;

  const priceForm: FormGroup<PriceSettingsForm> = new FormGroup<PriceSettingsForm>({
    token: new FormGroup({
      tokenId: new FormControl('', [Validators.required]),
      chainId: new FormControl('', [Validators.required])
    }),
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
    component.currentNetworkObs = of(currentNetworkSample);
    component.tokenSelected = tokenSample;
    component.paymentConversion = paymentConversionStoreSample;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have priceForm initialized correctly', () => {
    expect(component.priceForm).toBeInstanceOf(FormGroup);
  });

  it('should have chainId initialized correctly', (done) => {
    component.currentNetworkObs = of(currentNetworkSample);
    component.currentNetworkObs.subscribe((networkDetail) => {
      if (networkDetail) {
        expect(Object.values(NetworkChainId)).toContain(networkDetail.chainId);
        done();
      }
    });
  });

  it('should have tokenAmount initialized correctly', () => {
    component.paymentConversion = paymentConversionStoreSample;
    expect(typeof component.paymentConversion.data.tokenAmount).toBe('number');
  });

  it('should have usdAmount initialized correctly', () => {
    component.paymentConversion = paymentConversionStoreSample;
    expect(typeof component.paymentConversion.data.usdAmount).toBe('number');
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
