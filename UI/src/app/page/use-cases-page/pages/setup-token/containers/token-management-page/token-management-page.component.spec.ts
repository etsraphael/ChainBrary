import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentTokenManagementState } from './../../../../../../store/tokens-management-store/state/init';
import { initialState as transactionInitialState } from './../../../../../../store/transaction-store/state/init';
import { TokenManagementPageComponent } from './token-management-page.component';

describe('TokenManagementPageComponent', () => {
  let component: TokenManagementPageComponent;
  let fixture: ComponentFixture<TokenManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          auth: () => authInitialState,
          'token-management': () => documentTokenManagementState,
          transactions: () => transactionInitialState
        })
      ],
      declarations: [TokenManagementPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
