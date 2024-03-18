import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NetworkChainId, NetworkVersion, TokenId } from '@chainbrary/web3-login';
import { of } from 'rxjs';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { StoreState, Vault } from './../../../../shared/interfaces';
import { WithdrawTokenCardComponent } from './withdraw-token-card.component';

describe('WithdrawTokenCardComponent', () => {
  let component: WithdrawTokenCardComponent;
  let fixture: ComponentFixture<WithdrawTokenCardComponent>;

  const vaultObs: StoreState<Vault | null> | null = {
    data: {
      network: {
        contractAddress: '0x',
        networkDetail: {
          chainId: NetworkChainId.ETHEREUM,
          networkVersion: NetworkVersion.ETHEREUM,
          name: 'Ethereum Mainnet',
          shortName: 'Ethereum',
          nativeCurrency: {
            id: TokenId.ETHEREUM,
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          blockExplorerUrls: 'https://etherscan.io'
        }
      },
      data: {
        TVL: 0,
        TVS: 0,
        fullNetworkReward: 0,
        userStaked: 0,
        userReward: 0
      }
    },
    loading: false,
    error: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [WithdrawTokenCardComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(WithdrawTokenCardComponent);
    component = fixture.componentInstance;
    component.vaultObs = of(vaultObs);
    component.errorMessage = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
