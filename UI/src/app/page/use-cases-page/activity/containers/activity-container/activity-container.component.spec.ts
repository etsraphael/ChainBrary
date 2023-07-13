import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityContainerComponent } from './activity-container.component';

describe('ActivityContainerComponent', () => {
  let component: ActivityContainerComponent;
  let fixture: ComponentFixture<ActivityContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
