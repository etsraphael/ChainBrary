import '@angular/compiler';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PaymentRequestCardComponent } from './payment-request-card.component';
import { snackbarMock } from '../../../../../shared/tests/modules/modules.mock';
import { priceFeedServiceMock, walletServiceMock } from '../../../../../shared/tests/services/services.mock';
import { paymentRequestMock } from '../../../../../shared/tests/variables/payment-request';
import { ethereumNetworkMock } from '../../../../../shared/tests/variables/network-detail';

describe('PaymentRequestCardComponent', () => {
  const component: PaymentRequestCardComponent = new PaymentRequestCardComponent(
    snackbarMock,
    walletServiceMock,
    priceFeedServiceMock
  );

  beforeEach(() => {
    component.tokenConversionRate = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tokenConversionRate value if usd data is enabled', () => {
    component.paymentRequest = paymentRequestMock;
    const amount = paymentRequestMock.payment.data?.amount;
    const result = 4500;

    priceFeedServiceMock.getCurrentPriceOfNativeToken = vi.fn()
      .mockResolvedValue(result);

    component.setUpCurrentPrice();

    priceFeedServiceMock.getCurrentPriceOfNativeToken(ethereumNetworkMock.chainId)
      .then((result) => {
        expect(component.tokenConversionRate).toBe(amount as number / result);
      });
  });

  it('should not set tokenConversionRate value if usd data is disabled', () => {
    component.paymentRequest = paymentRequestMock;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    component.paymentRequest.payment.data!.usdEnabled = false;

    component.setUpCurrentPrice();

    priceFeedServiceMock.getCurrentPriceOfNativeToken(ethereumNetworkMock.chainId)
      .then((result) => {
        expect(component.tokenConversionRate).not.toBe(result);
      });
  });
});
