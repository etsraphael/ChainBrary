import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCardComponent } from './service-card.component';
import { SharedTestModule } from '../shared-components.module';

describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceCardComponent],
      imports: [SharedTestModule]
    });
    fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;
    component.card = {
      title: 'Test',
      description: 'Test',
      img: 'Test',
      routerUrl: 'Test'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
