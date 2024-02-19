import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../../../module/material.module';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { PartnershipPageContainerComponent } from './partnership-page-container.component';
import { LandingPageCardComponent } from '../../components/landing-page-card/landing-page-card.component';

describe('PartnershipPageContainerComponent', () => {
  let component: PartnershipPageContainerComponent;
  let fixture: ComponentFixture<PartnershipPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, SharedComponentsModule, RouterTestingModule],
      declarations: [PartnershipPageContainerComponent, LandingPageCardComponent]
    });
    fixture = TestBed.createComponent(PartnershipPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
