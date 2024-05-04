import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopQrCodeHomeComponent } from './shop-qr-code-home.component';

describe('ShopQrCodeHomeComponent', () => {
  let component: ShopQrCodeHomeComponent;
  let fixture: ComponentFixture<ShopQrCodeHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopQrCodeHomeComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
