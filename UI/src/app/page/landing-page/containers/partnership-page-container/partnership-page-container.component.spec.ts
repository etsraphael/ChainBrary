import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipPageContainerComponent } from './partnership-page-container.component';

describe('PartnershipPageContainerComponent', () => {
  let component: PartnershipPageContainerComponent;
  let fixture: ComponentFixture<PartnershipPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnershipPageContainerComponent]
    });
    fixture = TestBed.createComponent(PartnershipPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
