import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentTokenManagementState } from './../../../../../../store/tokens-management-store/state/init';
import { initialState as transactionInitialState } from './../../../../../../store/transaction-store/state/init';
import { TokenCreationFormComponent } from './token-creation-form.component';

describe('TokenCreationFormComponent', () => {
  let component: TokenCreationFormComponent;
  let fixture: ComponentFixture<TokenCreationFormComponent>;

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
      declarations: [TokenCreationFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
