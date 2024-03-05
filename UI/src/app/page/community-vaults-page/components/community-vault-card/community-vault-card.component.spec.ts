import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityVaultCardComponent } from './community-vault-card.component';

describe('CommunityVaultCardComponent', () => {
  let component: CommunityVaultCardComponent;
  let fixture: ComponentFixture<CommunityVaultCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityVaultCardComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
