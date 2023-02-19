import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageBodyComponent } from './landing-page-body.component';

describe('LandingPageBodyComponent', () => {
  let component: LandingPageBodyComponent;
  let fixture: ComponentFixture<LandingPageBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageBodyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
