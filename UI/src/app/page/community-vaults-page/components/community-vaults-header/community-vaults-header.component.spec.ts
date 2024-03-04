import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityVaultsHeaderComponent } from './community-vaults-header.component';

describe('CommunityVaultsHeaderComponent', () => {
  let component: CommunityVaultsHeaderComponent;
  let fixture: ComponentFixture<CommunityVaultsHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityVaultsHeaderComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
