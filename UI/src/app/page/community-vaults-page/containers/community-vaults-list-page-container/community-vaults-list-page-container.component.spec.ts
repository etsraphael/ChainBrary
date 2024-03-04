import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityVaultsListPageContainerComponent } from './community-vaults-list-page-container.component';

describe('CommunityVaultsListPageContainerComponent', () => {
  let component: CommunityVaultsListPageContainerComponent;
  let fixture: ComponentFixture<CommunityVaultsListPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityVaultsListPageContainerComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultsListPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
