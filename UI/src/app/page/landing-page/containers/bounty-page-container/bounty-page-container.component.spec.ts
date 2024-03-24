import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BountyPageContainerComponent } from './bounty-page-container.component';

describe('BountyPageContainerComponent', () => {
  let component: BountyPageContainerComponent;
  let fixture: ComponentFixture<BountyPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
