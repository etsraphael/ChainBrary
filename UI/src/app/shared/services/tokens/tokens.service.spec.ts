import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../../components/shared-components.module';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let service: TokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, StoreModule.forRoot({})]
    });
    service = TestBed.inject(TokensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
