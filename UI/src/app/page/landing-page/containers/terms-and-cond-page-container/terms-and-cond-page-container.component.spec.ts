import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndCondPageContainerComponent } from './terms-and-cond-page-container.component';

describe('TermsAndCondPageContainerComponent', () => {
  let component: TermsAndCondPageContainerComponent;
  let fixture: ComponentFixture<TermsAndCondPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndCondPageContainerComponent]
    });
    fixture = TestBed.createComponent(TermsAndCondPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
