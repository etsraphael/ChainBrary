import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import { PaymentRequestCardComponent } from './payment-request-card.component';

describe('PaymentRequestCardComponent', () => {
  let component: PaymentRequestCardComponent;
  let fixture: ComponentFixture<PaymentRequestCardComponent>;

  const paymentRequest: IPaymentRequestState = {
    payment: {
      data: null,
      loading: false,
      error: null
    },
    profile: {
      publicAddress: null,
      avatarUrl: null,
      username: null
    },
    network: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SharedTestModule],
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
