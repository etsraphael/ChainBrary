import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesSidebarHeaderComponent } from './use-cases-sidebar-header.component';

describe('UseCasesSidebarHeaderComponent', () => {
  let component: UseCasesSidebarHeaderComponent;
  let fixture: ComponentFixture<UseCasesSidebarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCasesSidebarHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesSidebarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
