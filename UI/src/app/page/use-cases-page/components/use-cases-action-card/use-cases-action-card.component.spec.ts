import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCasesSharedComponentsModule } from '../user-cases-shared-components.module';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { UseCasesActionCardComponent } from './use-cases-action-card.component';

describe('UseCasesActionCardComponent', () => {
  let component: UseCasesActionCardComponent;
  let fixture: ComponentFixture<UseCasesActionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [UseCasesActionCardComponent]
    });
    fixture = TestBed.createComponent(UseCasesActionCardComponent);
    component = fixture.componentInstance;
    component.payload = {
      title: '',
      descritpion: '',
      routerLink: '',
      buttonText: '',
      imgSrc: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
