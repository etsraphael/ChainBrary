import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { UserCasesSharedComponentsModule } from './../../../../../use-cases-page/components/user-cases-shared-components.module';
import { HomeBidMenuComponent } from './home-bid-menu.component';

describe('HomeBidMenuComponent', () => {
  let component: HomeBidMenuComponent;
  let fixture: ComponentFixture<HomeBidMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserCasesSharedComponentsModule, SharedTestModule],
      declarations: [HomeBidMenuComponent]
    });
    fixture = TestBed.createComponent(HomeBidMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
