import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityVaultsHomePageContainerComponent } from './community-vaults-home-page-container.component';

describe('CommunityVaultsHomePageContainerComponent', () => {
  let component: CommunityVaultsHomePageContainerComponent;
  let fixture: ComponentFixture<CommunityVaultsHomePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityVaultsHomePageContainerComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultsHomePageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
