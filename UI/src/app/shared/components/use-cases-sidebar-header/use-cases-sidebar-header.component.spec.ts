import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { UseCasesSidebarHeaderComponent } from './use-cases-sidebar-header.component';
import { formatServiceMock, web3LoginServiceMock } from '../../tests';
import { storeMock } from '../../tests';
import { ethereumNetworkMock } from '../../tests';
import * as authActions from '../../../store/auth-store/state/actions';

describe('UseCasesSidebarHeaderComponent', () => {
  const component: UseCasesSidebarHeaderComponent = new UseCasesSidebarHeaderComponent(
    storeMock,
    formatServiceMock,
    web3LoginServiceMock
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getNetworkDetailList when setup network', () => {
    const spyOnNetworkDetail = vi.spyOn(web3LoginServiceMock, 'getNetworkDetailList')
      .mockReturnValue([ethereumNetworkMock]);

    component.networkSetUp();

    expect(spyOnNetworkDetail).toHaveBeenCalled();
  });

  it('should call resetAuth when user logout', () => {
    const spyOnResetAuth = vi.spyOn(authActions, 'resetAuth');
    component.logOut();

    expect(spyOnResetAuth).toHaveBeenCalled();
  });

  it('should call networkChange when user change network', () => {
    const spyOnNetworkChange = vi.spyOn(authActions, 'networkChange');
    component.changeNetwork(ethereumNetworkMock);

    expect(spyOnNetworkChange).toHaveBeenCalled();
  });
});
