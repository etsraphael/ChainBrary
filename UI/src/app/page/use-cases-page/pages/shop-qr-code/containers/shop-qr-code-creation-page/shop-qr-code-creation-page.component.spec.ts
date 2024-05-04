import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopQrCodeCreationPageComponent } from './shop-qr-code-creation-page.component';

describe('ShopQrCodeCreationPageComponent', () => {
  let component: ShopQrCodeCreationPageComponent;
  let fixture: ComponentFixture<ShopQrCodeCreationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopQrCodeCreationPageComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodeCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
