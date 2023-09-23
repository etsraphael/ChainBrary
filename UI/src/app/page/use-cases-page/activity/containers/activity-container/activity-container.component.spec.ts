import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { ActivityContainerComponent } from './activity-container.component';
import { storeMock } from '../../../../../shared/tests';
import { INetworkDetail } from '@chainbrary/web3-login';
import { BehaviorSubject } from 'rxjs';
import * as actions from '../../../../../store/transaction-store/state/actions';
import { ethereumNetworkMock, polygonNetworkMock, sepoliaNetworkMock } from '../../../../../shared/tests';

describe('ActivityContainerComponent', () => {
  const component: ActivityContainerComponent = new ActivityContainerComponent(
    storeMock,
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call list of transactions', () => {
    const transactionsParams = { page: 1, limit: 1000000 };
    const spyOnTransactions = vi.spyOn(actions, 'loadTransactionsFromBridgeTransfer');

    component.callActions();

    expect(spyOnTransactions).toHaveBeenCalledWith(transactionsParams);
  });

  it('should call list of transactions again after network changes', () => {
    const networkSub$ = new BehaviorSubject<INetworkDetail | null>(ethereumNetworkMock);
    component.currentNetwork$ = networkSub$.asObservable();
    const spyOnCallActions = vi.spyOn(component, 'callActions');

    component.generateSubs();

    networkSub$.next(polygonNetworkMock);
    expect(spyOnCallActions).toBeCalledTimes(1);
    networkSub$.next(sepoliaNetworkMock);
    expect(spyOnCallActions).toBeCalledTimes(2);
  });
});
