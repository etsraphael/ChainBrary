import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderBodyPageComponent } from 'src/app/shared/components/header-body-page/header-body-page.component';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { ShopQrCodeMenuComponent } from './shop-qr-code-menu.component';

describe('ShopQrCodeMenuComponent', () => {
  let component: ShopQrCodeMenuComponent;
  let fixture: ComponentFixture<ShopQrCodeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [ShopQrCodeMenuComponent, HeaderBodyPageComponent]
    });
    fixture = TestBed.createComponent(ShopQrCodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
