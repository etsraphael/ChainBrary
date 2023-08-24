import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { WalletService } from './wallet.service';
import { web3LoginServiceMock } from '../../tests/services/services.mock';
import { storeMock } from '../../tests/modules/modules.mock';

describe('WalletService', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService(web3LoginServiceMock, storeMock);
  });

  it('should be created', () => {
    expect(walletService).toBeTruthy();
  });
});
