import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { PaymentRequestMakerComponent } from '../../components/payment-request-maker/payment-request-maker.component';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../store/auth-store/state/init';
import { initialState as paymentRequestInitialState } from './../../../../../store/payment-request-store/state/init';
import { PaymentRequestContainerComponent } from './payment-request-container.component';
import { PaymentRequestProfileSettingsComponent } from '../../components/payment-request-profile-settings/payment-request-profile-settings.component';
import { PaymentRequestPriceSettingsComponent } from '../../components/payment-request-price-settings/payment-request-price-settings.component';
import { PaymentRequestReviewComponent } from '../../components/payment-request-review/payment-request-review.component';

describe('PaymentRequestContainerComponent', () => {
  let component: PaymentRequestContainerComponent;
  let fixture: ComponentFixture<PaymentRequestContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState,
          paymentRequest: () => paymentRequestInitialState
        }),
        SharedTestModule
      ],
      declarations: [
        PaymentRequestContainerComponent,
        PaymentRequestMakerComponent,
        PaymentRequestProfileSettingsComponent,
        PaymentRequestReviewComponent,
        PaymentRequestPriceSettingsComponent
      ],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
