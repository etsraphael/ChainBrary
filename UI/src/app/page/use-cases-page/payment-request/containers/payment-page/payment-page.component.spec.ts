import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { PaymentPageComponent } from './payment-page.component';
import { routeMock, snackbarMock, storeMock } from '../../../../../shared/tests/modules/modules.mock';
import { web3LoginServiceMock } from '../../../../../shared/tests/services/services.mock';
import { Subject, of } from 'rxjs';
import { ethereumNetworkMock } from '../../../../../shared/tests/variables/network-detail';
import { IPaymentRequestState } from 'src/app/store/payment-request-store/state/interfaces';
import { paymentRequestMock } from '../../../../../shared/tests/variables/payment-request';
import * as authActions from '../../../../../store/auth-store/state/actions';
import * as paymentRequestActions from '../../../../../store/payment-request-store/state/actions';
import { IModalState, INetworkDetail } from '@chainbrary/web3-login';
import { EventEmitter } from '@angular/core';

describe('PaymentPageComponent', () => {
  const paramsObs$ = of({ id: 'mockedId' });
  routeMock.params = paramsObs$;

  const component: PaymentPageComponent = new PaymentPageComponent(
    routeMock,
    storeMock,
    web3LoginServiceMock,
    snackbarMock
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
