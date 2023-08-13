import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { PaymentPageComponent } from './payment-page.component';
import { routeMock, snackbarMock, storeMock } from 'src/app/shared/tests/modules/modules.mock';
import { web3LoginServiceMock } from 'src/app/shared/tests/services/services.mock';
import { Subject, of } from 'rxjs';
import { ethereumNetworkMock } from 'src/app/shared/tests/variables/network-detail';
import { IPaymentRequestState } from 'src/app/store/payment-request-store/state/interfaces';
import { paymentRequestMock } from 'src/app/shared/tests/variables/payment-request';
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
    const paymentRequest$ = new Subject<IPaymentRequestState>();
    component.selectPaymentRequestState$ = paymentRequest$.asObservable();
    const spyOnNetworkDetail = vi.spyOn(web3LoginServiceMock, 'getNetworkDetailByChainId')
      .mockResolvedValue(ethereumNetworkMock);

    component.setUpMessage();
    paymentRequest$.next(paymentRequestMock);

    expect(spyOnNetworkDetail).toHaveBeenCalled();
  });

  it.skip('should call setAuthPublicAddress when open login modal', () => {
    const openLoginModalEmitter = new EventEmitter<IModalState>();
    vi.spyOn(web3LoginServiceMock, 'openLoginModal').mockReturnValue(openLoginModalEmitter);
    const spyOnAuthPublicAddress = vi.spyOn(authActions, 'setAuthPublicAddress');

    component.openLoginModal();
    openLoginModalEmitter.emit();

    expect(spyOnAuthPublicAddress).toHaveBeenCalled();
  });

  it.skip('should submit payment successfully when network is supported', () => {
    const payload = { priceValue: 10000 };
    const networkSub$ = new Subject<INetworkDetail>();
    vi.spyOn(web3LoginServiceMock, 'currentNetwork$', 'get').mockReturnValue(networkSub$.asObservable());
    const spyOnSendAmount = vi.spyOn(paymentRequestActions, 'sendAmount');

    component.submitPayment(payload);
    networkSub$.next(ethereumNetworkMock);

    expect(spyOnSendAmount).toHaveBeenCalled();
  });
});
