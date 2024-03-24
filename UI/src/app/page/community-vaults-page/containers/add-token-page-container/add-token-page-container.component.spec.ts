import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from './../../../../shared/components/shared-components.module';
import { initialState as authInitialState } from './../../../../store/auth-store/state/init';
import { AddTokenPageContainerComponent } from './add-token-page-container.component';

describe('AddTokenPageContainerComponent', () => {
  let component: AddTokenPageContainerComponent;
  let fixture: ComponentFixture<AddTokenPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        RouterTestingModule,
        StoreModule.forRoot({
          auth: () => authInitialState
        })
      ],
      declarations: [AddTokenPageContainerComponent]
    });
    fixture = TestBed.createComponent(AddTokenPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
