import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownModule } from 'ngx-markdown';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { PrivacyPolicyPageContainerComponent } from './privacy-policy-page-container.component';

describe('PrivacyPolicyPageContainerComponent', () => {
  let component: PrivacyPolicyPageContainerComponent;
  let fixture: ComponentFixture<PrivacyPolicyPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, MarkdownModule.forChild()],
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
