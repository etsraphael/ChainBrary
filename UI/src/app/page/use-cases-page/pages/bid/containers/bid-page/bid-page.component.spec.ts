import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { UserCasesSharedComponentsModule } from './../../../../components/user-cases-shared-components.module';
import { BidPageComponent } from './bid-page.component';

describe('BidPageComponent', () => {
  let component: BidPageComponent;
  let fixture: ComponentFixture<BidPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          auth: () => authInitialState
        }),
        SharedTestModule,
        UserCasesSharedComponentsModule
      ],
      declarations: [BidPageComponent]
    });
    fixture = TestBed.createComponent(BidPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
