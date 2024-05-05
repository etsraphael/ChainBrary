import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopQrCodeVisualComponent } from './shop-qr-code-visual.component';

describe('ShopQrCodeVisualComponent', () => {
  let component: ShopQrCodeVisualComponent;
  let fixture: ComponentFixture<ShopQrCodeVisualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopQrCodeVisualComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
