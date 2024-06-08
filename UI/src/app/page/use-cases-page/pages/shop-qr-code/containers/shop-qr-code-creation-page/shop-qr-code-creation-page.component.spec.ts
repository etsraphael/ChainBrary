import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { ShopQrCodePrinterComponent } from '../../components/shop-qr-code-printer/shop-qr-code-printer.component';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { ShopQrCodeCreationPageComponent } from './shop-qr-code-creation-page.component';
import { ShopQrCodeVisualComponent } from '../../components/shop-qr-code-visual/shop-qr-code-visual.component';

describe('ShopQrCodeCreationPageComponent', () => {
  let component: ShopQrCodeCreationPageComponent;
  let fixture: ComponentFixture<ShopQrCodeCreationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [ShopQrCodeCreationPageComponent, ShopQrCodePrinterComponent, ShopQrCodeVisualComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodeCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
