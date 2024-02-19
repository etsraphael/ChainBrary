import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingHomePageContainerComponent } from './landing-home-page-container.component';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LandingHomePageContainerComponent', () => {
  let component: LandingHomePageContainerComponent;
  let fixture: ComponentFixture<LandingHomePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsModule, RouterTestingModule, BrowserAnimationsModule],
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
