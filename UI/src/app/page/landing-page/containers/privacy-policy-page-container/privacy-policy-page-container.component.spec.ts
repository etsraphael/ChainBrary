import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyPageContainerComponent } from './privacy-policy-page-container.component';

describe('PrivacyPolicyPageContainerComponent', () => {
  let component: PrivacyPolicyPageContainerComponent;
  let fixture: ComponentFixture<PrivacyPolicyPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolicyPageContainerComponent]
    });
    fixture = TestBed.createComponent(PrivacyPolicyPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
