import { describe, expect, it, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let publicAddress: string;
  let chainId: string;

  beforeEach(() => {
    authService = new AuthService();

    publicAddress = '0x1234567890';
    authService.savePublicAddress(publicAddress);

    chainId = '11155111';
    authService.savechainId(chainId);
  });

  it('should save public address to localStorage', () => {
    const otherPublicAddress = '0x0987654321';
    authService.savePublicAddress(otherPublicAddress);

    const savedAddress = localStorage.getItem('publicAddress');
    expect(savedAddress).toBe(otherPublicAddress);
  });

  it('should get public address from localStorage', () => {
    const result = authService.getPublicAddress();
    expect(result).toBe(publicAddress);
  });

  it('should remove public address from localStorage', () => {
    const resulFromSet = authService.getPublicAddress();

    expect(resulFromSet).toBe(publicAddress);

    authService.removePublicAddress();

    const resulFromRemove = authService.getPublicAddress();
    expect(resulFromRemove).toBeNull();
  });

  it('should save chain id to localStorage', () => {
    const otherChainId = '1';
    authService.savechainId(otherChainId);

    const savedChainId = localStorage.getItem('chainId');
    expect(savedChainId).toBe(otherChainId);
  });

  it('should get chain id from localStorage', () => {
    const result = authService.getchainId();
    expect(result).toBe(chainId);
  });

  it('should remove chain id from localStorage', () => {
    const resulFromSet = authService.getchainId();

    expect(resulFromSet).toBe(chainId);

    authService.removechainId();

    const resulFromRemove = authService.getchainId();
    expect(resulFromRemove).toBeNull();
  });
});
