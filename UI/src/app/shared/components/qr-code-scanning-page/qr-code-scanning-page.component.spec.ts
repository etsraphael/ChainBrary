import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeScanningPageComponent } from './qr-code-scanning-page.component';

describe('QrCodeScanningPageComponent', () => {
  let component: QrCodeScanningPageComponent;
  let fixture: ComponentFixture<QrCodeScanningPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodeScanningPageComponent]
    });
    fixture = TestBed.createComponent(QrCodeScanningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
