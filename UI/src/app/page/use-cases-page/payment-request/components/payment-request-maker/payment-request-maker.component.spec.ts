import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentRequestMakerComponent } from './payment-request-maker.component';
import { priceFeedServiceMock, walletServiceMock } from '../../../../../shared/tests/services/services.mock';
import { snackbarMock } from '../../../../../shared/tests/modules/modules.mock';
import { INetworkDetail } from '@chainbrary/web3-login';
import { Subject, of, take } from 'rxjs';
import { ethereumNetworkMock, polygonNetworkMock } from '../../../../../shared/tests/variables/network-detail';

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
    const amount = 1000;
    const chainId = ethereumNetworkMock.chainId;

    vi.spyOn(priceFeedServiceMock, 'getCurrentPriceOfNativeToken')
      .mockRejectedValue(new Error('Error'));

    await component.setUpPriceCurrentPrice(amount, chainId);

    expect(component.usdConversionRate).toBe(0);
  });

  it('should setup current price if amount change', () => {
    // Mock setupForm
    const networkSub$ = new Subject<INetworkDetail | null>();
    component.currentNetworkObs = networkSub$.asObservable();

    const spyOnSetupPrice = vi.spyOn(component, 'setUpPriceCurrentPrice').mockResolvedValue();

    component.setUpForm();
    component.mainForm.controls['price'].controls['amount'].setValue(100);
    component.mainForm.controls['price'].controls['usdEnabled'].setValue(true);

    networkSub$.next(ethereumNetworkMock);

    // Mock listenToAmountChange
    component.listenToAmountChange();
    networkSub$.next(polygonNetworkMock);
    expect(spyOnSetupPrice).toHaveBeenCalledTimes(2);
  });

  it('should get public address if exist', () => {
    const publicAddressHash = '0x1234567890abcdef';
    const publicAddressValue = component.mainForm.controls['profile'].controls['publicAddress'].value;
    const publicAddressSub$ = new Subject<string | null>();
    component.publicAddressObs = publicAddressSub$.asObservable();

    component.listenToAddressChange();

    publicAddressSub$.next(publicAddressHash);
    publicAddressSub$.subscribe(() => {
      expect(publicAddressValue).toBe(publicAddressHash);
    });
    publicAddressSub$.unsubscribe();
  });

  it('should set an empty public address if not exist', () => {
    const publicAddressHash = null;
    const publicAddressValue = component.mainForm.controls['profile'].controls['publicAddress'].value;
    const publicAddressSub$ = new Subject<string | null>();
    component.publicAddressObs = publicAddressSub$.asObservable();

    component.listenToAddressChange();

    publicAddressSub$.next(publicAddressHash);
    publicAddressSub$.subscribe(() => {
      expect(publicAddressValue).toBe('');
    });
    publicAddressSub$.unsubscribe();
  });

  it('should call getCurrentPriceOfNativeToken when swap currency & usd is enabled', () => {
    // Mock setUpForm
    const networkSub$ = new Subject<INetworkDetail | null>();
    component.currentNetworkObs = networkSub$.asObservable();

    vi.spyOn(component, 'setUpPriceCurrentPrice').mockResolvedValue();

    component.setUpForm();
    networkSub$.next(ethereumNetworkMock);

    // Mock swapCurrency
    component.mainForm.controls['price'].controls['usdEnabled'].setValue(true);
    const spyOnCurrentPrice = vi.spyOn(priceFeedServiceMock, 'getCurrentPriceOfNativeToken')
      .mockResolvedValue(100);

    component.swapCurrency();
    networkSub$.next(polygonNetworkMock);

    expect(spyOnCurrentPrice).toHaveBeenCalled();
  });

  it('should not call getCurrentPriceOfNativeToken when swap currency if usd disabled', () => {
    // Mock setUpForm
    const networkSub$ = new Subject<INetworkDetail | null>();
    component.currentNetworkObs = networkSub$.asObservable();

    vi.spyOn(component, 'setUpPriceCurrentPrice').mockResolvedValue();

    component.setUpForm();
    networkSub$.next(ethereumNetworkMock);

    // Mock swapCurrency
    component.mainForm.controls['price'].controls['usdEnabled'].setValue(false);
    const spyOnCurrentPrice = vi.spyOn(priceFeedServiceMock, 'getCurrentPriceOfNativeToken');

    component.swapCurrency();
    networkSub$.next(polygonNetworkMock);

    expect(spyOnCurrentPrice).not.toHaveBeenCalled();
  });
});
