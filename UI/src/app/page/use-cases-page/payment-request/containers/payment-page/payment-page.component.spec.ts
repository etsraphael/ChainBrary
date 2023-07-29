import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { PaymentRequestCardComponent } from '../../components/payment-request-card/payment-request-card.component';
import { SharedTestModule } from './../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../store/auth-store/state/init';
import { initialState as paymentRequestInitialState } from './../../../../../store/payment-request-store/state/init';
import { initialState as transactionInitialState } from './../../../../../store/transaction-store/state/init';
import { PaymentPageComponent } from './payment-page.component';

describe('PaymentPageComponent', () => {
  let component: PaymentPageComponent;
  let fixture: ComponentFixture<PaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          paymentRequest: () => paymentRequestInitialState,
          transactions: () => transactionInitialState,
          auth: () => authInitialState
        }),
        SharedTestModule
      ],
      declarations: [PaymentPageComponent, PaymentRequestCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
