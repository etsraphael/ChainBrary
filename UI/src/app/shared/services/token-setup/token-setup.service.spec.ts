import { TestBed } from '@angular/core/testing';
import { TokenSetupService } from './token-setup.service';
import { SharedTestModule } from '../../components/shared-components.module';
import { StoreModule } from '@ngrx/store';

describe('TokenSetupService', () => {
  let service: TokenSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, StoreModule.forRoot({})]
    });
    service = TestBed.inject(TokenSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
