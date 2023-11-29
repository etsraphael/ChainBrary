import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as bidInitialState } from './../../../../../../store/bid-store/state/init';
import { UserCasesSharedComponentsModule } from './../../../../../use-cases-page/components/user-cases-shared-components.module';
import { BidCreationComponent } from './bid-creation.component';

describe('BidCreationComponent', () => {
  let component: BidCreationComponent;
  let fixture: ComponentFixture<BidCreationComponent>;

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
      declarations: [BidCreationComponent]
    });
    fixture = TestBed.createComponent(BidCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
