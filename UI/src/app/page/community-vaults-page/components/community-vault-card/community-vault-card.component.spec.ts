import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NetworkChainId, NetworkVersion, TokenId } from '@chainbrary/web3-login';
import { StoreState, Vault } from './../../../../shared/interfaces';
import { CommunityVaultCardComponent } from './community-vault-card.component';

describe('CommunityVaultCardComponent', () => {
  let component: CommunityVaultCardComponent;
  let fixture: ComponentFixture<CommunityVaultCardComponent>;

  const vault: StoreState<Vault | null> = {
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
      imports: [RouterTestingModule],
      declarations: [CommunityVaultCardComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultCardComponent);
    component = fixture.componentInstance;
    component.vault = vault;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
