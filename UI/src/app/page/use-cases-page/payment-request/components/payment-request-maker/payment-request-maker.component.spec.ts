import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { INetworkDetail } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { PaymentRequestProfileSettingsComponent } from '../payment-request-profile-settings/payment-request-profile-settings.component';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { PaymentRequestMakerComponent } from './payment-request-maker.component';

describe('PaymentRequestMakerComponent', () => {
  let component: PaymentRequestMakerComponent;
  let fixture: ComponentFixture<PaymentRequestMakerComponent>;

  const publicAddressObs: Observable<string | null> = of(null);
  const currentNetworkObs: Observable<INetworkDetail | null> = of(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SharedTestModule],
      declarations: [PaymentRequestMakerComponent, PaymentRequestProfileSettingsComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestMakerComponent);
    component = fixture.componentInstance;
    component.publicAddressObs = publicAddressObs;
    component.currentNetworkObs = currentNetworkObs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
