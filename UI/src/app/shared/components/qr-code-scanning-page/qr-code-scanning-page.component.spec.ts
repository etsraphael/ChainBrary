import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { QrCodeScanningPageComponent } from './qr-code-scanning-page.component';

describe('QrCodeScanningPageComponent', () => {
  let component: QrCodeScanningPageComponent;
  let fixture: ComponentFixture<QrCodeScanningPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxScannerQrcodeModule],
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
