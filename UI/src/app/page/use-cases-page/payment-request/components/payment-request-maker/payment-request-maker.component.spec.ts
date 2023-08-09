import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentRequestMakerComponent } from './payment-request-maker.component';
import { priceFeedServiceMock, walletServiceMock } from 'src/app/shared/tests/services/services.mock';
import { snackbarMock } from 'src/app/shared/tests/modules/modules.mock';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Subject, of } from 'rxjs';
import { ethereumNetworkMock, polygonNetworkMock } from 'src/app/shared/tests/variables/activity-container';

describe('PaymentRequestMakerComponent', () => {
  const component: PaymentRequestMakerComponent = new PaymentRequestMakerComponent(
    snackbarMock,
    walletServiceMock,
    priceFeedServiceMock
  );

  beforeEach(() => {
    component.currentNetworkObs = of(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return usd conversion rate 0 if something bad happen on setup price', async () => {
    vi.spyOn(priceFeedServiceMock, 'getCurrentPriceOfNativeToken')
      .mockImplementation(() => { return Promise.reject() });

    await component.setUpPriceCurrentPrice(1, ethereumNetworkMock.chainId);

    setTimeout(() => {
      expect(component.usdConversionRate).toBe(0);
    }, 100);
  });

  it('should setup current price if amount change', () => {
    const network$ = new Subject<INetworkDetail | null>();
    component.currentNetworkObs = network$.asObservable();

    const spyOnSetupPrice = vi.spyOn(component, 'setUpPriceCurrentPrice')
      .mockImplementation(() => { return Promise.resolve() });

    component.setUpForm();
    component.mainForm.controls['price'].controls['amount'].setValue(100);
    component.mainForm.controls['price'].controls['usdEnabled'].setValue(true);

    network$.next(ethereumNetworkMock);

    component.listenToAmountChange();
    network$.next(polygonNetworkMock);
    expect(spyOnSetupPrice).toHaveBeenCalledTimes(2);
  });

  it('should get public address if exist', () => {
    const publicAddressHash = '0x1234567890abcdef';
    const publicAddressValue = component.mainForm.controls['profile'].controls['publicAddress'].value;
    const publicAddress$ = new Subject<string | null>();
    component.publicAddressObs = publicAddress$.asObservable();

    component.listenToAddressChange();

    publicAddress$.next(publicAddressHash);
    setTimeout(() => {
      expect(publicAddressValue).toBe(publicAddressHash);
    }, 100);
  });

  it('should set an empty public address if not exist', () => {
    const publicAddressHash = null;
    const publicAddressValue = component.mainForm.controls['profile'].controls['publicAddress'].value;
    const publicAddress$ = new Subject<string | null>();
    component.publicAddressObs = publicAddress$.asObservable();

    component.listenToAddressChange();

    publicAddress$.next(publicAddressHash);
    setTimeout(() => {
      expect(publicAddressValue).toBe('');
    }, 100);
  });
});
