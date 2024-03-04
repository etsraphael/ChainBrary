import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderBodyPageComponent } from './header-body-page.component';

describe('HeaderBodyPageComponent', () => {
  let component: HeaderBodyPageComponent;
  let fixture: ComponentFixture<HeaderBodyPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
