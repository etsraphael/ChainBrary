import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedTestModule } from '../shared-components.module';
import { HeaderBodyPageComponent } from './header-body-page.component';

describe('HeaderBodyPageComponent', () => {
  let component: HeaderBodyPageComponent;
  let fixture: ComponentFixture<HeaderBodyPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, RouterTestingModule],
      declarations: [HeaderBodyPageComponent]
    });
    fixture = TestBed.createComponent(HeaderBodyPageComponent);
    component = fixture.componentInstance;
    component.header = {
      title: 'title',
      description: 'description',
      goBackLink: '/use-cases/services'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
