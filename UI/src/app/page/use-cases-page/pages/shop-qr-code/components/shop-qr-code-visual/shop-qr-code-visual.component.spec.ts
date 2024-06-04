import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { ShopQrCodeVisualComponent } from './shop-qr-code-visual.component';

describe('ShopQrCodeVisualComponent', () => {
  let component: ShopQrCodeVisualComponent;
  let fixture: ComponentFixture<ShopQrCodeVisualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
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
