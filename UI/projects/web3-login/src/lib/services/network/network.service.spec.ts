import { TestBed } from '@angular/core/testing';
import { NetworkServiceWeb3Login } from './network.service';
import { SharedTestModule } from './../../../../../../src/app/shared/components/shared-components.module';

describe('NetworkServiceWeb3Login', () => {
  let service: NetworkServiceWeb3Login;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      providers: [NetworkServiceWeb3Login]
    });
    service = TestBed.inject(NetworkServiceWeb3Login);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
