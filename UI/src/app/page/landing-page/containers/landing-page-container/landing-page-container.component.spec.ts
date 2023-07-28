import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { LandingPageBodyComponent } from '../../components/landing-page-body/landing-page-body.component';
import { MaterialModule } from './../../../../module/material.module';
import { LandingPageContainerComponent } from './landing-page-container.component';
import { LandingPageHeaderPageComponent } from '../../components/landing-page-header/landing-page-header.component';

describe('LandingPageContainerComponent', () => {
  let component: LandingPageContainerComponent;
  let fixture: ComponentFixture<LandingPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule, RouterTestingModule],
      declarations: [LandingPageContainerComponent, LandingPageHeaderPageComponent, LandingPageBodyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
