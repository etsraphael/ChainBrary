import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageCardComponent } from './landing-page-card.component';

describe('LandingPageCardComponent', () => {
  let component: LandingPageCardComponent;
  let fixture: ComponentFixture<LandingPageCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageCardComponent]
    });
    fixture = TestBed.createComponent(LandingPageCardComponent);
    component = fixture.componentInstance;
    component.card = {
      icon: 'icon',
      title: 'title',
      description: 'description'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
