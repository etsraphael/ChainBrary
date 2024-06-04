import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../../../../components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { PayNowNotFoundPageComponent } from './pay-now-not-found-page.component';

describe('PayNowNotFoundPageComponent', () => {
  let component: PayNowNotFoundPageComponent;
  let fixture: ComponentFixture<PayNowNotFoundPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [PayNowNotFoundPageComponent]
    });
    fixture = TestBed.createComponent(PayNowNotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
