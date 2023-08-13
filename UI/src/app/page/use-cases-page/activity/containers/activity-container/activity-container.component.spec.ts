import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { ActivityContainerComponent } from './activity-container.component';
import { storeMock } from 'src/app/shared/tests/modules/modules.mock';
import { INetworkDetail } from '@chainbrary/web3-login';
import { BehaviorSubject } from 'rxjs';
import * as actions from '../../../../../store/transaction-store/state/actions';
import { ethereumNetworkMock, polygonNetworkMock, sepoliaNetworkMock } from 'src/app/shared/tests/variables/network-detail';

describe('ActivityContainerComponent', () => {
  const component: ActivityContainerComponent = new ActivityContainerComponent(
    storeMock,
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call list of transactions', () => {
    const transactionsParams = { page: 1, limit: 1000000 };
    const spyTransactions = vi.spyOn(actions, 'loadTransactionsFromBridgeTransfer');

    component.callActions();

    expect(spyTransactions).toHaveBeenCalledWith(transactionsParams);
  });

  it('should call list of transactions again after network changes', () => {
    const network$ = new BehaviorSubject<INetworkDetail | null>(ethereumNetworkMock);
    component.currentNetwork$ = network$.asObservable();
    const spyCallActions = vi.spyOn(component, 'callActions');

    component.generateSubs();

    network$.next(polygonNetworkMock);
    expect(spyCallActions).toBeCalledTimes(1);
    network$.next(sepoliaNetworkMock);
    expect(spyCallActions).toBeCalledTimes(2);
  });
});
