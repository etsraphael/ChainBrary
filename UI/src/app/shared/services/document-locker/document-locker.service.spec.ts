import { TestBed } from '@angular/core/testing';

import { DocumentLockerService } from './document-locker.service';

describe('DocumentLockerService', () => {
  let service: DocumentLockerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentLockerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
