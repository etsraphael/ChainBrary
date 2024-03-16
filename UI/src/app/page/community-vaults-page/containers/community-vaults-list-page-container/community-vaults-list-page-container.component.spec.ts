import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../store/auth-store/state/init';
import { CommunityVaultsListPageContainerComponent } from './community-vaults-list-page-container.component';

describe('CommunityVaultsListPageContainerComponent', () => {
  let component: CommunityVaultsListPageContainerComponent;
  let fixture: ComponentFixture<CommunityVaultsListPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        RouterTestingModule,
        StoreModule.forRoot({
          auth: () => authInitialState
        })
      ],
      declarations: [CommunityVaultsListPageContainerComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultsListPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
