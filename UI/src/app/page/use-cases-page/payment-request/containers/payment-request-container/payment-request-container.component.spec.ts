import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { PaymentRequestContainerComponent } from './payment-request-container.component';
import { storeMock } from '../../../../../shared/tests';

describe('PaymentRequestContainerComponent', () => {
  const component: PaymentRequestContainerComponent = new PaymentRequestContainerComponent(
    storeMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
