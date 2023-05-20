import { TestBed } from '@angular/core/testing';
import { NetworkServiceWeb3Login } from './network.service';

describe('NetworkServiceWeb3Login', () => {
  let service: NetworkServiceWeb3Login;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkServiceWeb3Login);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
