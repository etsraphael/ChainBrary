import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { IBid, IBidOffer } from './../../../../../../shared/interfaces/bid.interface';
import { UserCasesSharedComponentsModule } from './../../../../components/user-cases-shared-components.module';
import { BidResultComponent } from './bid-result.component';
import { ActionStoreProcessing, StoreState } from './../../../../../../shared/interfaces';
import { requestWithdrawSuccess } from 'src/app/store/bid-store/state/actions';

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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
