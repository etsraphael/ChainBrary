import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkChainId, NetworkVersion, TokenId } from '@chainbrary/web3-login';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { AddTokenCardComponent } from './add-token-card.component';

describe('AddTokenCardComponent', () => {
  let component: AddTokenCardComponent;
  let fixture: ComponentFixture<AddTokenCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [AddTokenCardComponent]
    });
    fixture = TestBed.createComponent(AddTokenCardComponent);
    component = fixture.componentInstance;
    component.balance = {
      full: 0,
      short: 0
    };
    component.network = {
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
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
