import { ComponentFixture, TestBed } from '@angular/core/testing';
import { INetworkDetail, NetworkChainId, NetworkVersion, TokenId } from '@chainbrary/web3-login';
import { of } from 'rxjs';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { ActionStoreProcessing, StoreState } from './../../../../../../shared/interfaces';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { requestWithdrawSuccess } from './../../../../../../store/bid-store/state/actions';
import { UserCasesSharedComponentsModule } from './../../../../components/user-cases-shared-components.module';
import { BidResultComponent } from './bid-result.component';

describe('BidResultComponent', () => {
  let component: BidResultComponent;
  let fixture: ComponentFixture<BidResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestModule, UserCasesSharedComponentsModule],
      declarations: [BidResultComponent]
    });
    fixture = TestBed.createComponent(BidResultComponent);
    component = fixture.componentInstance;

    component.bidObs = of(<IBid>{
      conctractAddress: '',
      bidName: '',
      owner: '',
      imgLists: [],
      auctionStartTime: new Date(),
      auctionEndTime: new Date(),
      extendTimeInMinutes: 10,
      description: '',
      ownerName: '',
      highestBid: 10,
      blockNumber: '2',
      auctionAmountWithdrawn: false
    });

    component.bidderListStoreObs = of(<StoreState<IBidOffer[]>>{
      data: [],
      loading: false,
      error: null
    });

    component.startBidderCountdownTrigger = of();
    component.isOwner = false;
    component.bidWidthdrawingObs = of(<ActionStoreProcessing>{
      isLoading: false,
      errorMessage: null
    });

    component.requestWithdrawSuccessObs = of(<ReturnType<typeof requestWithdrawSuccess>>{
      txn: ''
    });

    component.currentNetwork = <INetworkDetail>{
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
