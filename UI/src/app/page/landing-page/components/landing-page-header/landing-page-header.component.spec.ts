import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { LandingPageHeaderPageComponent } from './landing-page-header.component';

describe('LandingPageHeaderPageComponent', () => {
  let component: LandingPageHeaderPageComponent;
  let fixture: ComponentFixture<LandingPageHeaderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedComponentsModule],
      declarations: [LandingPageHeaderPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageHeaderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
