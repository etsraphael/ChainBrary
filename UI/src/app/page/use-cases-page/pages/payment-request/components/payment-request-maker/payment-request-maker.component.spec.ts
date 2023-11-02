import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { INetworkDetail } from '@chainbrary/web3-login';
import { ofType } from '@ngrx/effects';
import { Action, StoreModule } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { IConversionToken, StoreState } from 'src/app/shared/interfaces';
import { PaymentRequestProfileSettingsComponent } from '../payment-request-profile-settings/payment-request-profile-settings.component';
import { PaymentRequestReviewComponent } from '../payment-request-review/payment-request-review.component';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import {
  accountChanged,
  networkChangeSuccess,
  resetAuth,
  setAuthPublicAddress
} from './../../../../../store/auth-store/state/actions';
import { initialState as authInitialState } from './../../../../../store/auth-store/state/init';
import { PaymentRequestMakerComponent } from './payment-request-maker.component';
import { PaymentRequestPriceSettingsComponent } from '../payment-request-price-settings/payment-request-price-settings.component';

describe('PaymentRequestMakerComponent', () => {
  let component: PaymentRequestMakerComponent;
  let fixture: ComponentFixture<PaymentRequestMakerComponent>;

  const publicAddressObs: Observable<string | null> = of(null);
  const currentNetworkObs: Observable<INetworkDetail | null> = of(null);
  const paymentConversionObs: Observable<StoreState<IConversionToken>> = of({
    data: {
      usdAmount: 100,
      tokenAmount: 2,
      priceInUsdEnabled: false
    },
    loading: false,
    error: null
  });

  const actions$ = new Subject<Action>();
  const resetTransactionObs = actions$.pipe(
    ofType(resetAuth, accountChanged, networkChangeSuccess, setAuthPublicAddress)
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState
        }),
        SharedTestModule
      ],
      declarations: [
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

    fixture = TestBed.createComponent(PaymentRequestMakerComponent);
    component = fixture.componentInstance;
    component.publicAddressObs = publicAddressObs;
    component.currentNetworkObs = currentNetworkObs;
    component.resetTransactionObs = resetTransactionObs;
    component.paymentConversionObs = paymentConversionObs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
