import { TestBed } from '@angular/core/testing';
import { CommunityVaultsService } from './community-vaults.service';

describe('CommunityVaultsService', () => {
  let service: CommunityVaultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityVaultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
