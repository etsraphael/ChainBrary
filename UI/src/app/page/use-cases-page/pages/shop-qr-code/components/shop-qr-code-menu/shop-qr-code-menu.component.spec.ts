import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopQrCodeMenuComponent } from './shop-qr-code-menu.component';

describe('ShopQrCodeMenuComponent', () => {
  let component: ShopQrCodeMenuComponent;
  let fixture: ComponentFixture<ShopQrCodeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopQrCodeMenuComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
