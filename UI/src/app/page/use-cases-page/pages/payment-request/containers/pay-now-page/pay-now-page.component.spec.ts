import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as paymentRequestInitialState } from './../../../../../../store/payment-request-store/state/init';
import { PayNowPageComponent } from './pay-now-page.component';

describe('PayNowPageComponent', () => {
  let component: PayNowPageComponent;
  let fixture: ComponentFixture<PayNowPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState,
          paymentRequest: () => paymentRequestInitialState
        }),
        SharedTestModule,
        UserCasesSharedComponentsModule
      ],
      declarations: [PayNowPageComponent]
    });
    fixture = TestBed.createComponent(PayNowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
