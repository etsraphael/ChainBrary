import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestModule } from '../shared-components.module';
import { DrawerSidebarComponent } from './drawer-sidebar.component';

describe('DrawerSidebarComponent', () => {
  let component: DrawerSidebarComponent;
  let fixture: ComponentFixture<DrawerSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawerSidebarComponent],
      imports: [SharedTestModule]
    });
    fixture = TestBed.createComponent(DrawerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
