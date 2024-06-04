import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { ShopQrCodeVisualComponent } from '../shop-qr-code-visual/shop-qr-code-visual.component';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { ShopQrCodePrinterComponent } from './shop-qr-code-printer.component';

describe('ShopQrCodePrinterComponent', () => {
  let component: ShopQrCodePrinterComponent;
  let fixture: ComponentFixture<ShopQrCodePrinterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [ShopQrCodePrinterComponent, ShopQrCodeVisualComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodePrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
