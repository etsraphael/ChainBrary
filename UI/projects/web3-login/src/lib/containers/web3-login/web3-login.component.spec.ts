import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { Web3LoginComponent } from './web3-login.component';
import { routerMock, snackbarMock } from '../../../../../../src/app/shared/tests/modules/modules.mock';
import { deviceServiceMock } from '../../../../../../src/app/shared/tests/services/services.mock';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { NetworkServiceWeb3Login } from '../../services/network/network.service';
import { Web3LoginConfig } from '@chainbrary/web3-login';
import { MatDialogRef } from '@angular/material/dialog';

describe('Web3LoginComponent', () => {
  const config = {} as Web3LoginConfig;

  const component: Web3LoginComponent = new Web3LoginComponent(
    {} as MatDialogRef<Web3LoginComponent>,
    new ErrorHandlerService(snackbarMock),
    new NetworkServiceWeb3Login(config),
    deviceServiceMock,
    routerMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logInWithMetamask when user open metamask wallet', () => {
    const providerKey = 'metamask';
    const spyOnLogInWithMetamask = vi.spyOn(component, 'logInWithMetamask')
      .mockReturnValue(undefined);

    component.openWalletProvider(providerKey);

    expect(spyOnLogInWithMetamask).toHaveBeenCalled();
  });
});
