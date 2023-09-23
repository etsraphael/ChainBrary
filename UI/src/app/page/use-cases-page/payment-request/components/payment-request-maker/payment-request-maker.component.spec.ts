import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { PaymentRequestMakerComponent } from './payment-request-maker.component';
import { formatServiceMock, walletServiceMock } from '../../../../../shared/tests';
import { snackbarMock } from '../../../../../shared/tests';
import { Subject, of } from 'rxjs';

describe('PaymentRequestMakerComponent', () => {
  const component: PaymentRequestMakerComponent = new PaymentRequestMakerComponent(
    snackbarMock,
    walletServiceMock,
    formatServiceMock
  );

  beforeEach(() => {
    component.currentNetworkObs = of(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get public address if exist', () => {
    component.setUpForm();
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
    component.setUpForm();
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
});
