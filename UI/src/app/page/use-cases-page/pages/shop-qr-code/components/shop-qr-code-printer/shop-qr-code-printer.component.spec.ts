import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopQrCodePrinterComponent } from './shop-qr-code-printer.component';

describe('ShopQrCodePrinterComponent', () => {
  let component: ShopQrCodePrinterComponent;
  let fixture: ComponentFixture<ShopQrCodePrinterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopQrCodePrinterComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodePrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
