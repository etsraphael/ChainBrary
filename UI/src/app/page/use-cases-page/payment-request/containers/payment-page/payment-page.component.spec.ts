import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { PaymentPageComponent } from './payment-page.component';
import { actionMock, routeMock, snackbarMock, storeMock } from '../../../../../shared/tests/modules/modules.mock';
import { web3LoginServiceMock } from '../../../../../shared/tests/services/services.mock';
import { Subject, of } from 'rxjs';
import { ethereumNetworkMock } from '../../../../../shared/tests/variables/network-detail';
import { IPaymentRequestState } from 'src/app/store/payment-request-store/state/interfaces';
import { paymentRequestMock } from '../../../../../shared/tests/variables/payment-request';

describe('PaymentPageComponent', () => {
  const paramsObs$ = of({ id: 'mockedId' });
  routeMock.params = paramsObs$;

  const component: PaymentPageComponent = new PaymentPageComponent(
    routeMock,
    storeMock,
    web3LoginServiceMock,
    snackbarMock,
    actionMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNetworkDetailByChainId when set up message', () => {
    const paymentRequestSub$ = new Subject<IPaymentRequestState>();
    component.selectPaymentRequestState$ = paymentRequestSub$.asObservable();
    const spyOnNetworkDetail = vi.spyOn(web3LoginServiceMock, 'getNetworkDetailByChainId')
      .mockReturnValue(ethereumNetworkMock);

    component.setUpMessage();
    paymentRequestSub$.next(paymentRequestMock);

    expect(spyOnNetworkDetail).toHaveBeenCalled();
  });
});
