import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesSidebarComponent } from './use-cases-sidebar.component';

describe('UseCasesSidebarComponent', () => {
  let component: UseCasesSidebarComponent;
  let fixture: ComponentFixture<UseCasesSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCasesSidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
