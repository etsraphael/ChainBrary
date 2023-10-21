import { TestBed } from '@angular/core/testing';
import { PublicGlobalValuesService } from './public-global-values.service';
import { NetworkServiceWeb3Login } from '../network/network.service';

describe('PublicGlobalValuesService', () => {
  let service: PublicGlobalValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkServiceWeb3Login, { provide: 'config', useValue: {} }]
    });
    service = TestBed.inject(PublicGlobalValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
