import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../store/auth-store/state/init';
import { CommunityVaultsHomePageContainerComponent } from './community-vaults-home-page-container.component';

describe('CommunityVaultsHomePageContainerComponent', () => {
  let component: CommunityVaultsHomePageContainerComponent;
  let fixture: ComponentFixture<CommunityVaultsHomePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        RouterTestingModule,
        StoreModule.forRoot({
          auth: () => authInitialState
        })
      ],
      declarations: [CommunityVaultsHomePageContainerComponent]
    });
    fixture = TestBed.createComponent(CommunityVaultsHomePageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
