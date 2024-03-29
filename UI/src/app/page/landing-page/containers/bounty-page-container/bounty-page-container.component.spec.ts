import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from './../../../../shared/components/shared-components.module';
import { BountyPageContainerComponent } from './bounty-page-container.component';
import { MarkdownModule } from 'ngx-markdown';

describe('BountyPageContainerComponent', () => {
  let component: BountyPageContainerComponent;
  let fixture: ComponentFixture<BountyPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsModule, RouterTestingModule, BrowserAnimationsModule, MarkdownModule.forChild()],
      declarations: [BountyPageContainerComponent]
    });
    fixture = TestBed.createComponent(BountyPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
