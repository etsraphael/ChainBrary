import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { ShopQrCodeHomeComponent } from './shop-qr-code-home.component';

describe('ShopQrCodeHomeComponent', () => {
  let component: ShopQrCodeHomeComponent;
  let fixture: ComponentFixture<ShopQrCodeHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
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
