import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { QrCodeContainerModalComponent } from './qr-code-container-modal.component';

describe('QrCodeContainerModalComponent', () => {
  const injectData = { qrCodeValue: 'A1F09B5C821E3D7F' }
  const component: QrCodeContainerModalComponent = new QrCodeContainerModalComponent(
    injectData
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
