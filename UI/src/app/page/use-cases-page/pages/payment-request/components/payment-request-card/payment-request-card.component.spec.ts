import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { IPaymentRequestState } from './../../../../../../store/payment-request-store/state/interfaces';
import { PaymentRequestCardComponent } from './payment-request-card.component';
import { initialState } from 'src/app/store/payment-request-store/state/init';

describe('PaymentRequestCardComponent', () => {
  let component: PaymentRequestCardComponent;
  let fixture: ComponentFixture<PaymentRequestCardComponent>;

  const paymentRequest: IPaymentRequestState = initialState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState
        }),
        SharedTestModule
      ],
      declarations: [PaymentRequestCardComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestCardComponent);
    component = fixture.componentInstance;
    component.paymentRequest = paymentRequest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
