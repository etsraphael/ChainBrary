import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from './../../../../../../page/use-cases-page/components/user-cases-shared-components.module';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { SetupTokenMenuComponent } from './setup-token-menu.component';

describe('SetupTokenMenuComponent', () => {
  let component: SetupTokenMenuComponent;
  let fixture: ComponentFixture<SetupTokenMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [SetupTokenMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SetupTokenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
