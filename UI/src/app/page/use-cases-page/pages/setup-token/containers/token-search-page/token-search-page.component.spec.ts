import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../../../store/auth-store/state/init';
import { initialState as documentTokenManagementState } from './../../../../../../store/tokens-management-store/state/init';
import { TokenSearchPageComponent } from './token-search-page.component';

describe('TokenSearchPageComponent', () => {
  let component: TokenSearchPageComponent;
  let fixture: ComponentFixture<TokenSearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          auth: () => authInitialState,
          'token-management': () => documentTokenManagementState
        })
      ],
      declarations: [TokenSearchPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
