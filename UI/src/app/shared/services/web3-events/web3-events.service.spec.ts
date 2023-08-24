import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { Web3EventsService } from './web3-events.service';
import { web3LoginServiceMock } from '../../tests/services/services.mock';
import { storeMock } from '../../tests/modules/modules.mock';

describe('Web3EventsService', () => {
  let web3EventsService: Web3EventsService;

  beforeEach(() => {
    web3EventsService = new Web3EventsService(web3LoginServiceMock, storeMock);
  });

  it('should be created', () => {
    expect(web3EventsService).toBeTruthy();
  });
});
