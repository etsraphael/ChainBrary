import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TokenCreationFormComponent } from '../../components/token-creation-form/token-creation-form.component';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentTokenManagementState } from './../../../../../../store/tokens-management-store/state/init';
import { initialState as transactionInitialState } from './../../../../../../store/transaction-store/state/init';
import { TokenCreationPageComponent } from './token-creation-page.component';

describe('TokenCreationPageComponent', () => {
  let component: TokenCreationPageComponent;
  let fixture: ComponentFixture<TokenCreationPageComponent>;

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
      declarations: [TokenCreationPageComponent, TokenCreationFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
