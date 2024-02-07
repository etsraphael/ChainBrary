import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingHomePageContainerComponent } from './landing-home-page-container.component';

describe('LandingHomePageContainerComponent', () => {
  let component: LandingHomePageContainerComponent;
  let fixture: ComponentFixture<LandingHomePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingHomePageContainerComponent]
    });
    fixture = TestBed.createComponent(LandingHomePageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
