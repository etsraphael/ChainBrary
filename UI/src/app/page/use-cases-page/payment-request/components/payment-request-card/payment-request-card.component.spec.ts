import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { PaymentRequestCardComponent } from './payment-request-card.component';
import { snackbarMock } from 'src/app/shared/tests/modules/modules.mock';
import { priceFeedServiceMock, walletServiceMock } from 'src/app/shared/tests/services/services.mock';

describe('PaymentRequestCardComponent', () => {
  const component: PaymentRequestCardComponent = new PaymentRequestCardComponent(
    snackbarMock,
    walletServiceMock,
    priceFeedServiceMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
