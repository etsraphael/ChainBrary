import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { SetupTokenHomeComponent } from './setup-token-home.component';

describe('SetupTokenHomeComponent', () => {
  let component: SetupTokenHomeComponent;
  let fixture: ComponentFixture<SetupTokenHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [SetupTokenHomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SetupTokenHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
