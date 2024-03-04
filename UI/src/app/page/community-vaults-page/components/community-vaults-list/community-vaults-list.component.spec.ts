import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityVaultsListComponent } from './community-vaults-list.component';

describe('CommunityVaultsListComponent', () => {
  let component: CommunityVaultsListComponent;
  let fixture: ComponentFixture<CommunityVaultsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityVaultsListComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
