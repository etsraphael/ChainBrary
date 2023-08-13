import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { PaymentRequestContainerComponent } from './payment-request-container.component';
import { storeMock } from 'src/app/shared/tests/modules/modules.mock';

describe('PaymentRequestContainerComponent', () => {
  const component: PaymentRequestContainerComponent = new PaymentRequestContainerComponent(
    storeMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
