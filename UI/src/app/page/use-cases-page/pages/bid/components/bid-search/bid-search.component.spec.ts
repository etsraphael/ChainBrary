import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as bidInitialState } from './../../../../../../store/bid-store/state/init';
import { UserCasesSharedComponentsModule } from './../../../../components/user-cases-shared-components.module';
import { BidSearchComponent } from './bid-search.component';

describe('BidSearchComponent', () => {
  let component: BidSearchComponent;
  let fixture: ComponentFixture<BidSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState,
          bid: () => bidInitialState
        }),
        SharedTestModule,
        UserCasesSharedComponentsModule
      ],
      declarations: [BidSearchComponent]
    });
    fixture = TestBed.createComponent(BidSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
