import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentRequestCardComponent } from './payment-request-card.component';
import { snackbarMock } from '../../../../../shared/tests/modules/modules.mock';
import { priceFeedServiceMock, walletServiceMock } from '../../../../../shared/tests';
import { Subject } from 'rxjs';
import { INetworkDetail } from '@chainbrary/web3-login';
import { ethereumNetworkMock } from '../../../../../shared/tests';
import { AuthStatusCode } from '../../../../../shared/enum';

describe('PaymentRequestCardComponent', () => {
  const component: PaymentRequestCardComponent = new PaymentRequestCardComponent(
    snackbarMock,
    walletServiceMock,
    priceFeedServiceMock
  );

  beforeEach(() => {
    component.tokenConversionRate = 0;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listenToNetworkChange call setUpConversion', () => {
    const networkSub$ = new Subject<INetworkDetail | null>();
    component.currentNetworkObs = networkSub$.asObservable();

    const spyOnSetUpConversion = vi.spyOn(component, 'setUpConversion')
      .mockResolvedValue();

    component.listenToNetworkChange();
    networkSub$.next(ethereumNetworkMock);

    expect(spyOnSetUpConversion).toHaveBeenCalled();
  });

  it('should reset conversion return tokenConversionRate = 0', () => {
    component.tokenConversionRate = 100;
    component.resetConversion();

    expect(component.tokenConversionRate).toBe(0);
  });

  it('should return if not connected when submit amont', () => {
    component.authStatus = AuthStatusCode.NotConnected;
    const spyOnSnackbar = vi.spyOn(snackbarMock, 'open');

    component.submitAmount();

    expect(spyOnSnackbar).toBeCalledWith('Please connect your wallet', '', { duration: 3000 });
  });
});
